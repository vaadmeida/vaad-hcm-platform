import { Prisma, CalculationBaseType, MonthlyPayrollStatus } from "@prisma/client";
import prisma from "../../config/prisma.ts";
import { AppError } from "../../errors/appError.ts";
import type { EmployeePayrollSnapshot, GetPayrollByIdParams, GetPayrollsInput, PreparePayrollInput, SalaryPeriod } from "./payroll.types.ts";
import { getPresignedUrl } from "../../config/storage.ts";

export const preparePayroll = async (
    input: PreparePayrollInput,
    userId: string
) => {
    const { month, year } = input;

    // Check whether payroll already exists for this period.
    const existingPayroll = await prisma.monthlyPayroll.findUnique({
        where: {
            year_month: {
                year,
                month,
            },
        },
    });

    if (existingPayroll) {
        throw new AppError(
            "Payroll has already been prepared for this month.",
            409,
            "PAYROLL_ALREADY_EXISTS"
        );
    }

    // Calculate payroll period boundaries in UTC.
    const periodStart = new Date(Date.UTC(year, month - 1, 1));
    const periodEnd = new Date(Date.UTC(year, month, 0, 23, 59, 59, 999));

    try {
        const payroll = await prisma.monthlyPayroll.create({
            data: {
                month,
                year,
                periodStart,
                periodEnd,
                status: "DRAFT",
                preparedBy: userId,
                preparedAt: new Date(),
            },
        });

        return payroll;
    } catch (error) {
        // Handle a duplicate request that reaches the database concurrently.
        if (
            error instanceof Prisma.PrismaClientKnownRequestError &&
            error.code === "P2002"
        ) {
            throw new AppError(
                "Payroll has already been prepared for this month.",
                409,
                "PAYROLL_ALREADY_EXISTS"
            );
        }

        throw error;
    }
};

const ELIGIBLE_STATUSES = [
    "active",
    "inactive",
    "unconfirmed",
];

const EXIT_STATUSES = [
    "resigned",
    "terminated",
    "dismissed",
];


const DAY_IN_MS = 24 * 60 * 60 * 1000;

const getDaysInPeriod = (start: Date, end: Date) =>
    Math.floor((end.getTime() - start.getTime()) / DAY_IN_MS) + 1;

const getMonthDays = (year: number, month: number) =>
    new Date(Date.UTC(year, month, 0)).getUTCDate();

const maxDate = (first: Date, second: Date) =>
    first > second ? first : second;

const minDate = (first: Date, second: Date) =>
    first < second ? first : second;

const decimal = (value: Prisma.Decimal | number) =>
    new Prisma.Decimal(value.toString());

const prorate = (
    amount: Prisma.Decimal,
    days: number,
    monthDays: number
) =>
    amount
        .mul(days)
        .div(monthDays)
        .toDecimalPlaces(2);

export const calculateMonthlyPayroll = async (
    payrollId: string
) => {
    return prisma.$transaction(async (tx) => {
        const payroll = await tx.monthlyPayroll.findUnique({
            where: { id: payrollId },
        });

        if (!payroll) {
            throw new AppError(
                "Payroll period not found.",
                404,
                "PAYROLL_NOT_FOUND"
            );
        }

        if (!["DRAFT", "CALCULATED"].includes(payroll.status)) {
            throw new AppError(
                "Only draft or calculated payrolls can be recalculated.",
                400,
                "PAYROLL_NOT_EDITABLE"
            );
        }

        const monthDays = getMonthDays(
            payroll.year,
            payroll.month
        );

        const employees = await tx.employee.findMany({
            where: {
                OR: [
                    {
                        status: {
                            in: ELIGIBLE_STATUSES,
                        },
                    },
                    {
                        status: {
                            in: EXIT_STATUSES,
                        },
                        date_exited: {
                            gte: payroll.periodStart,
                            lte: payroll.periodEnd,
                        },
                    },
                ],
            },
            include: {
                departments: {
                    include: {
                        department: true,
                    },
                },
                salaries: {
                    where: {
                        effectiveDate: {
                            lte: payroll.periodEnd,
                        },
                        OR: [
                            { endDate: null },
                            {
                                endDate: {
                                    gte: payroll.periodStart,
                                },
                            },
                        ],
                    },
                    include: {
                        components: true,
                        additionalEarnings: true,
                    },
                    orderBy: {
                        effectiveDate: "asc",
                    },
                },
            },
        });

        const employeeSnapshots: EmployeePayrollSnapshot[] = [];

        const skippedEmployees: {
            employeeId: string;
            employeeName: string;
            reason: string;
        }[] = [];

        // Release previously calculated, unpaid 13th Month records
        // before recalculating this December payroll.
        if (payroll.month === 12) {
            await tx.annualEarningPayment.updateMany({
                where: {
                    payrollId,
                    type: "THIRTEENTH_MONTH",
                    status: "PENDING",
                },
                data: {
                    payrollId: null,
                },
            });
        }

        for (const employee of employees) {
            const employeeName =
                `${employee.first_name} ${employee.last_name}`;

            const employmentStart = employee.hire_date
                ? maxDate(
                    employee.hire_date,
                    payroll.periodStart
                )
                : payroll.periodStart;

            const employmentEnd = employee.date_exited
                ? minDate(
                    employee.date_exited,
                    payroll.periodEnd
                )
                : payroll.periodEnd;

            if (employmentStart > employmentEnd) {
                continue;
            }

            const salaries = employee.salaries;

            if (salaries.length === 0) {
                skippedEmployees.push({
                    employeeId: employee.id,
                    employeeName,
                    reason: "SALARY_NOT_CONFIGURED",
                });
                continue;
            }

            const salaryPeriods: SalaryPeriod[] = [];

            for (let index = 0; index < salaries.length; index++) {
                const salary = salaries[index];
                const nextSalary = salaries[index + 1];

                const salaryStart = maxDate(
                    employmentStart,
                    salary.effectiveDate
                );

                let salaryEnd = minDate(
                    employmentEnd,
                    salary.endDate ?? payroll.periodEnd
                );

                if (nextSalary) {
                    const dayBeforeNextSalary = new Date(
                        nextSalary.effectiveDate.getTime() - DAY_IN_MS
                    );

                    salaryEnd = minDate(
                        salaryEnd,
                        dayBeforeNextSalary
                    );
                }

                if (salaryStart > salaryEnd) {
                    continue;
                }

                const days = getDaysInPeriod(
                    salaryStart,
                    salaryEnd
                );

                salaryPeriods.push({
                    salary,
                    startDate: salaryStart,
                    endDate: salaryEnd,
                    days,
                });
            }

            if (salaryPeriods.length === 0) {
                skippedEmployees.push({
                    employeeId: employee.id,
                    employeeName,
                    reason: "NO_SALARY_FOR_PAYROLL_PERIOD",
                });
                continue;
            }

            const employmentDays = getDaysInPeriod(
                employmentStart,
                employmentEnd
            );

            const totalCoveredDays = salaryPeriods.reduce(
                (total, period) => total + period.days,
                0
            );

            if (totalCoveredDays > employmentDays) {
                throw new AppError(
                    `Overlapping salary records found for ${employeeName}.`,
                    409,
                    "OVERLAPPING_SALARY_RECORDS"
                );
            }

            let monthlyGross = new Prisma.Decimal(0);
            let totalPaye = new Prisma.Decimal(0);
            let annualBaseSalary = new Prisma.Decimal(0);
            let annualBasicSalary = new Prisma.Decimal(0);
            let additionalEarnings = new Prisma.Decimal(0);

            let hasBasicSalaryComponent = false;

            const componentTotals = new Map<
                string,
                {
                    percentage: Prisma.Decimal;
                    annualAmount: Prisma.Decimal;
                    monthlyAmount: Prisma.Decimal;
                }
            >();

            const earningSnapshots: EmployeePayrollSnapshot["earnings"] = [];

            // Calculate salary and recurring earnings for each salary period.
            for (const period of salaryPeriods) {
                const { salary, days } = period;

                monthlyGross = monthlyGross.plus(
                    prorate(
                        salary.monthlyGross,
                        days,
                        monthDays
                    )
                );

                totalPaye = totalPaye.plus(
                    prorate(
                        salary.paye,
                        days,
                        monthDays
                    )
                );

                annualBaseSalary = annualBaseSalary.plus(
                    prorate(
                        salary.annualBaseSalary,
                        days,
                        monthDays
                    )
                );

                for (const component of salary.components) {
                    const normalizedName = component.name
                        .trim()
                        .toLowerCase();

                    const proratedAnnualAmount = prorate(
                        component.annualAmount,
                        days,
                        monthDays
                    );

                    const monthlyComponent = component.annualAmount.div(12);

                    const proratedMonthlyAmount = prorate(
                        monthlyComponent,
                        days,
                        monthDays
                    );

                    if (normalizedName.includes("basic")) {
                        hasBasicSalaryComponent = true;

                        annualBasicSalary = annualBasicSalary.plus(
                            proratedAnnualAmount
                        );
                    }

                    const existing = componentTotals.get(
                        component.name
                    );

                    if (existing) {
                        existing.annualAmount =
                            existing.annualAmount.plus(
                                proratedAnnualAmount
                            );

                        existing.monthlyAmount =
                            existing.monthlyAmount.plus(
                                proratedMonthlyAmount
                            );
                    } else {
                        componentTotals.set(component.name, {
                            percentage: component.percentage,
                            annualAmount: proratedAnnualAmount,
                            monthlyAmount: proratedMonthlyAmount,
                        });
                    }
                }

                // Only recurring monthly earnings belong here.
                // Annual earnings are handled separately.
                for (const earning of salary.additionalEarnings) {
                    if (earning.frequency !== "MONTHLY") {
                        continue;
                    }

                    const amount = prorate(
                        earning.amount,
                        days,
                        monthDays
                    );

                    additionalEarnings =
                        additionalEarnings.plus(amount);

                    earningSnapshots.push({
                        name: earning.name,
                        amount: amount.toDecimalPlaces(2),
                        calculationType: earning.calculationType,
                        percentage: earning.percentage,
                        calculationBase: earning.calculationBase,
                        calculationBaseType:
                            earning.calculationBaseType
                                ? earning.calculationBaseType as CalculationBaseType
                                : null,
                        frequency: "MONTHLY",
                    });
                }
            }

            // 13th Month: 15% of annual basic salary, December only.
            if (payroll.month === 12) {
                if (!hasBasicSalaryComponent) {
                    throw new AppError(
                        `Basic Salary component is missing for ${employeeName}. Cannot calculate 13th Month.`,
                        400,
                        "BASIC_SALARY_COMPONENT_MISSING"
                    );
                }

                const existingPayment =
                    await tx.annualEarningPayment.findUnique({
                        where: {
                            employeeId_type_year: {
                                employeeId: employee.id,
                                type: "THIRTEENTH_MONTH",
                                year: payroll.year,
                            },
                        },
                    });

                // Never pay the same year's 13th Month twice.
                if (existingPayment?.status !== "PAID") {
                    const thirteenthMonthAmount =
                        annualBasicSalary
                            .mul(15)
                            .div(100)
                            .toDecimalPlaces(2);

                    if (thirteenthMonthAmount.greaterThan(0)) {
                        if (existingPayment) {
                            await tx.annualEarningPayment.update({
                                where: {
                                    id: existingPayment.id,
                                },
                                data: {
                                    amount: thirteenthMonthAmount,
                                    payrollId,
                                },
                            });
                        } else {
                            await tx.annualEarningPayment.create({
                                data: {
                                    employeeId: employee.id,
                                    type: "THIRTEENTH_MONTH",
                                    year: payroll.year,
                                    amount: thirteenthMonthAmount,
                                    status: "PENDING",
                                    payrollId,
                                },
                            });
                        }

                        additionalEarnings =
                            additionalEarnings.plus(
                                thirteenthMonthAmount
                            );

                        earningSnapshots.push({
                            name: "13th Month",
                            amount: thirteenthMonthAmount,
                            calculationType: "PERCENTAGE",
                            percentage: new Prisma.Decimal(15),
                            calculationBase: annualBasicSalary,
                            calculationBaseType: "BASIC_SALARY",
                            frequency: "ANNUAL",
                        });
                    }
                }
            }

            const otherDeductions = new Prisma.Decimal(0);

            const grossPay = monthlyGross.plus(
                additionalEarnings
            );

            const netPay = grossPay
                .minus(totalPaye)
                .minus(otherDeductions)
                .toDecimalPlaces(2);

            if (netPay.lessThan(0)) {
                throw new AppError(
                    `PAYE and deductions exceed gross pay for ${employeeName}.`,
                    400,
                    "INVALID_NET_PAY"
                );
            }

            employeeSnapshots.push({
                employeeId: employee.id,
                employeeName,
                employeeNumber: employee.employee_code,
                employeeEmail: employee.email,
                jobTitle: employee.job_title,
                departmentNames: employee.departments.map(
                    (item) => item.department.name
                ),
                annualBaseSalary: annualBaseSalary.toDecimalPlaces(2),
                monthlyGross: monthlyGross.toDecimalPlaces(2),
                additionalEarnings:
                    additionalEarnings.toDecimalPlaces(2),
                grossPay: grossPay.toDecimalPlaces(2),
                paye: totalPaye.toDecimalPlaces(2),
                otherDeductions,
                netPay,
                components: Array.from(
                    componentTotals.entries()
                ).map(([name, values]) => ({
                    name,
                    percentage: values.percentage,
                    annualAmount:
                        values.annualAmount.toDecimalPlaces(2),
                    monthlyAmount:
                        values.monthlyAmount.toDecimalPlaces(2),
                })),
                earnings: earningSnapshots,
            });
        }

        // Calculate payroll totals.
        const totals = employeeSnapshots.reduce(
            (result, employee) => ({
                gross: result.gross.plus(employee.grossPay),
                earnings: result.earnings.plus(
                    employee.additionalEarnings
                ),
                paye: result.paye.plus(employee.paye),
                deductions: result.deductions.plus(
                    employee.otherDeductions
                ),
                net: result.net.plus(employee.netPay),
            }),
            {
                gross: new Prisma.Decimal(0),
                earnings: new Prisma.Decimal(0),
                paye: new Prisma.Decimal(0),
                deductions: new Prisma.Decimal(0),
                net: new Prisma.Decimal(0),
            }
        );

        // Get existing payroll employee snapshots.
        const existingEmployees =
            await tx.monthlyPayrollEmployee.findMany({
                where: { payrollId },
                select: { id: true },
            });

        const existingIds = existingEmployees.map(
            (item) => item.id
        );

        if (existingIds.length > 0) {
            // Do not silently delete generated payslips.
            const existingPayslips = await tx.payslip.count({
                where: {
                    payrollEmployeeId: {
                        in: existingIds,
                    },
                },
            });

            if (existingPayslips > 0) {
                throw new AppError(
                    "This payroll has generated payslips. Delete or resolve them before recalculating.",
                    400,
                    "PAYSLIPS_ALREADY_GENERATED"
                );
            }

            await tx.payrollEmployeeComponent.deleteMany({
                where: {
                    payrollEmployeeId: {
                        in: existingIds,
                    },
                },
            });

            await tx.payrollEmployeeEarning.deleteMany({
                where: {
                    payrollEmployeeId: {
                        in: existingIds,
                    },
                },
            });

            await tx.monthlyPayrollEmployee.deleteMany({
                where: { payrollId },
            });
        }

        // Create fresh payroll employee snapshots.
        for (const employee of employeeSnapshots) {
            await tx.monthlyPayrollEmployee.create({
                data: {
                    payrollId,
                    employeeId: employee.employeeId,
                    employeeName: employee.employeeName,
                    employeeNumber: employee.employeeNumber,
                    employeeEmail: employee.employeeEmail,
                    jobTitle: employee.jobTitle,
                    departmentNames: employee.departmentNames,
                    annualBaseSalary: employee.annualBaseSalary,
                    monthlyGross: employee.monthlyGross,
                    additionalEarnings: employee.additionalEarnings,
                    grossPay: employee.grossPay,
                    paye: employee.paye,
                    otherDeductions: employee.otherDeductions,
                    netPay: employee.netPay,
                    components: {
                        create: employee.components,
                    },
                    earnings: {
                        create: employee.earnings,
                    },
                },
            });
        }

        const updatedPayroll =
            await tx.monthlyPayroll.update({
                where: { id: payrollId },
                data: {
                    status: "CALCULATED",
                    totalEmployees: employeeSnapshots.length,
                    totalGross: totals.gross,
                    totalEarnings: totals.earnings,
                    totalPaye: totals.paye,
                    totalDeductions: totals.deductions,
                    totalNetPay: totals.net,
                    skippedEmployees,
                },
                include: {
                    employees: {
                        include: {
                            components: true,
                            earnings: true,
                        },
                    },
                    annualEarningPayments: true,
                },
            });

        return {
            payroll: updatedPayroll,
            skippedEmployees,
        };
    });
};

export const getPayrollById = async (
    payrollId: string,
    params: GetPayrollByIdParams
) => {
    const {
        search,
        department,
        page = 1,
        limit = 7,
    } = params;

    const payroll = await prisma.monthlyPayroll.findUnique({
        where: { id: payrollId },
        include: {
            annualEarningPayments: {
                orderBy: {
                    createdAt: "asc",
                },
            },
        },
    });

    if (!payroll) {
        throw new AppError(
            "Payroll period not found.",
            404,
            "PAYROLL_NOT_FOUND"
        );
    }

    const where = {
        payrollId,
        ...(search && {
            OR: [
                {
                    employeeName: {
                        contains: search,
                        mode: "insensitive" as const,
                    },
                },
                {
                    employeeNumber: {
                        contains: search,
                        mode: "insensitive" as const,
                    },
                },
            ],
        }),
        ...(department && {
            departmentNames: {
                has: department,
            },
        }),
    };

    const [employees, totalEmployees, allEmployees] = await Promise.all([
        prisma.monthlyPayrollEmployee.findMany({
            where,
            include: {
                components: true,
                earnings: true,
                payslip: true,
                employee: {
                    select: {
                        avatar_url: true,
                        employee_code: true
                    },
                },
            },
            orderBy: {
                employeeName: "asc",
            },
            skip: (page - 1) * limit,
            take: limit,
        }),

        prisma.monthlyPayrollEmployee.count({ where }),

        prisma.monthlyPayrollEmployee.findMany({
            where: { payrollId },
            select: {
                departmentNames: true,
            },
        }),
    ]);

    const departments = [
        ...new Set(
            allEmployees.flatMap(
                (employee) => employee.departmentNames
            )
        ),
    ].sort();

    const employeesWithAvatar = await Promise.all(
        employees.map(async (employee) => ({
            ...employee,
            employee: employee.employee
                ? {
                    ...employee.employee,
                    avatar_url: employee.employee.avatar_url
                        ? await getPresignedUrl(employee.employee.avatar_url)
                        : null,
                }
                : null,
        }))
    );

    return {
        ...payroll,
        employees: employeesWithAvatar,
        departments,
        pagination: {
            page,
            limit,
            total: totalEmployees,
            totalPages: Math.ceil(totalEmployees / limit),
        },
    };
};


export const getPayrolls = async (query: GetPayrollsInput) => {
    const { page, limit, year, month, status, search } = query;

    const skip = (page - 1) * limit;

    const searchYear =
        search && /^\d{4}$/.test(search)
            ? Number(search)
            : undefined;

    const where: Prisma.MonthlyPayrollWhereInput = {
        ...(year && { year }),
        ...(month && { month }),
        ...(status && { status }),
        ...(searchYear && { year: searchYear }),
    };

    const [payrolls, total, availableYears] = await Promise.all([
        prisma.monthlyPayroll.findMany({
            where,
            orderBy: [
                { year: "desc" },
                { month: "desc" },
            ],
            skip,
            take: limit,
            select: {
                id: true,
                month: true,
                year: true,
                status: true,
                totalEmployees: true,
                totalGross: true,
                totalEarnings: true,
                totalPaye: true,
                totalDeductions: true,
                totalNetPay: true,
                preparedAt: true,
                createdAt: true,
            },
        }),

        prisma.monthlyPayroll.count({ where }),

        prisma.monthlyPayroll.findMany({
            distinct: ["year"],
            select: {
                year: true,
            },
            orderBy: {
                year: "desc",
            },
        }),
    ]);

    return {
        years: availableYears.map((item) => item.year),

        payrolls,

        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};


export const reviewPayroll = async (
    payrollId: string,
    userId: string
) => {
    return prisma.$transaction(async (tx) => {
        const payroll = await tx.monthlyPayroll.findUnique({
            where: { id: payrollId },
        });

        if (!payroll) {
            throw new AppError(
                "Payroll period not found.",
                404,
                "PAYROLL_NOT_FOUND"
            );
        }

        if (payroll.status !== "CALCULATED") {
            throw new AppError(
                "Only calculated payrolls can be reviewed.",
                400,
                "PAYROLL_NOT_READY_FOR_REVIEW"
            );
        }

        return tx.monthlyPayroll.update({
            where: { id: payrollId },
            data: {
                status: "REVIEWED",
                reviewedBy: userId,
                reviewedAt: new Date(),
            },
        });
    });
};

export const approvePayroll = async (
    payrollId: string,
    userId: string
) => {
    return prisma.$transaction(async (tx) => {
        const payroll = await tx.monthlyPayroll.findUnique({
            where: { id: payrollId },
        });

        if (!payroll) {
            throw new AppError(
                "Payroll period not found.",
                404,
                "PAYROLL_NOT_FOUND"
            );
        }

        if (payroll.status !== "REVIEWED") {
            throw new AppError(
                "Only reviewed payrolls can be approved.",
                400,
                "PAYROLL_NOT_READY_FOR_APPROVAL"
            );
        }

        return tx.monthlyPayroll.update({
            where: { id: payrollId },
            data: {
                status: "APPROVED",
                approvedBy: userId,
                approvedAt: new Date(),
            },
        });
    });
}

export const processPayroll = async (payrollId: string, userId: string) => {
    return prisma.$transaction(async (tx) => {
        const processedAt = new Date();

        const { count } = await tx.monthlyPayroll.updateMany({
            where: {
                id: payrollId,
                status: "APPROVED",
            },
            data: {
                status: "PROCESSED",
                processedBy: userId,
                processedAt,
            },
        });

        const payroll = await tx.monthlyPayroll.findUnique({
            where: { id: payrollId },
        });

        if (!payroll) {
            throw new AppError(
                "Payroll period not found.",
                404,
                "PAYROLL_NOT_FOUND"
            );
        }

        if (count === 0) {
            // A retry after a successful request returns the existing result.
            if (payroll.status === "PROCESSED") return payroll;

            throw new AppError(
                "Only approved payrolls can be processed.",
                409,
                "PAYROLL_NOT_READY_FOR_PROCESSING"
            );
        }

        await tx.annualEarningPayment.updateMany({
            where: {
                payrollId,
                type: "THIRTEENTH_MONTH",
                status: "PENDING",
            },
            data: {
                status: "PAID",
                paidAt: processedAt,
            },
        });

        return payroll;
    });
};

export const deletePayroll = async (payrollId: string): Promise<void> => {
    await prisma.$transaction(async (tx) => {
        const [payroll] = await tx.$queryRaw<{ status: string }[]>`
            SELECT "status"
            FROM "MonthlyPayroll"
            WHERE "id" = ${payrollId}::uuid
            FOR UPDATE
        `;

        if (!payroll) {
            throw new AppError(
                "Payroll period not found.",
                404,
                "PAYROLL_NOT_FOUND"
            );
        }

        if (payroll.status !== "DRAFT" && payroll.status !== "CALCULATED") {
            throw new AppError(
                "Only draft or calculated payrolls can be deleted.",
                409,
                "PAYROLL_NOT_DELETABLE"
            );
        }

        const employees = await tx.monthlyPayrollEmployee.findMany({
            where: { payrollId },
            select: { id: true },
        });
        const employeeIds = employees.map((employee) => employee.id);

        const payslip = await tx.payslip.findFirst({
            where: { payrollEmployeeId: { in: employeeIds } },
            select: { id: true },
        });

        if (payslip) {
            throw new AppError(
                "This payroll has generated payslips.",
                409,
                "PAYSLIPS_ALREADY_GENERATED"
            );
        }

        const paidEarning = await tx.annualEarningPayment.findFirst({
            where: { payrollId, status: "PAID" },
            select: { id: true },
        });

        if (paidEarning) {
            throw new AppError(
                "This payroll has a paid annual earning.",
                409,
                "PAYROLL_HAS_PAID_EARNINGS"
            );
        }

        await tx.annualEarningPayment.updateMany({
            where: { payrollId, status: "PENDING" },
            data: { payrollId: null },
        });

        await tx.payrollEmployeeEarning.deleteMany({
            where: { payrollEmployeeId: { in: employeeIds } },
        });

        await tx.payrollEmployeeComponent.deleteMany({
            where: { payrollEmployeeId: { in: employeeIds } },
        });

        await tx.monthlyPayrollEmployee.deleteMany({
            where: { payrollId },
        });

        await tx.monthlyPayroll.delete({
            where: { id: payrollId },
        });
    });
};