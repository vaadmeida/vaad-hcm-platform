
import {
    Prisma,
    CalculationBaseType,
    EarningCalculationType,
    EarningFrequency,
    AnnualEarningType,
    AnnualEarningStatus,
} from "@prisma/client";

import prisma from "../../config/prisma.ts";
import { AppError } from "../../errors/appError.ts";

const ELIGIBLE_EMPLOYEE_STATUSES = [
    "active",
    "inactive",
    "unconfirmed",
] as const;

const THIRTEENTH_MONTH_RATE = new Prisma.Decimal(15);

const toUtcDate = (date: Date): Date =>
    new Date(
        Date.UTC(
            date.getUTCFullYear(),
            date.getUTCMonth(),
            date.getUTCDate()
        )
    );

const getDaysBetweenInclusive = (
    startDate: Date,
    endDate: Date
): number => {
    const millisecondsPerDay = 24 * 60 * 60 * 1000;

    return (
        Math.round(
            (toUtcDate(endDate).getTime() -
                toUtcDate(startDate).getTime()) /
                millisecondsPerDay
        ) + 1
    );
};

const getLaterDate = (first: Date, second: Date): Date =>
    first > second ? first : second;

const getEarlierDate = (first: Date, second: Date): Date =>
    first < second ? first : second;

const prorateAmount = (
    amount: Prisma.Decimal,
    daysWorked: number,
    daysInMonth: number
): Prisma.Decimal =>
    amount
        .mul(daysWorked)
        .div(daysInMonth)
        .toDecimalPlaces(2);

export const calculateMonthlyPayroll = async (
    payrollId: string
) => {
    return prisma.$transaction(
        async (tx) => {
            // 1. Retrieve payroll period.
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

            // 2. Only draft or calculated payrolls
            // can be recalculated.
            if (
                payroll.status !== "DRAFT" &&
                payroll.status !== "CALCULATED"
            ) {
                throw new AppError(
                    "Only draft or calculated payrolls can be recalculated.",
                    400,
                    "PAYROLL_CANNOT_BE_CALCULATED"
                );
            }

            // Do not invalidate existing payslips.
            const existingPayslips = await tx.payslip.count({
                where: {
                    payrollEmployee: {
                        payrollId,
                    },
                },
            });

            if (existingPayslips > 0) {
                throw new AppError(
                    "Payroll already has payslips. Recalculation is not allowed.",
                    409,
                    "PAYROLL_HAS_PAYSLIPS"
                );
            }

            const periodStart = toUtcDate(payroll.periodStart);
            const periodEnd = toUtcDate(payroll.periodEnd);

            const daysInMonth = new Date(
                Date.UTC(payroll.year, payroll.month, 0)
            ).getUTCDate();

            // 3. Retrieve employees and salary structures
            // that overlap the payroll period.
            const employees = await tx.employee.findMany({
                where: {
                    status: {
                        in: [...ELIGIBLE_EMPLOYEE_STATUSES],
                    },
                    salaries: {
                        some: {
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
                    },
                },
                include: {
                    departments: {
                        include: {
                            department: {
                                select: {
                                    name: true,
                                },
                            },
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
                        orderBy: {
                            effectiveDate: "asc",
                        },
                        include: {
                            components: true,
                            additionalEarnings: true,
                        },
                    },
                },
            });

            // 4. Prepare employee payroll snapshots.
            const employeeSnapshots = [];

            for (const employee of employees) {
                if (
                    employee.hire_date &&
                    toUtcDate(employee.hire_date) > periodEnd
                ) {
                    continue;
                }

                const employeeStart = employee.hire_date
                    ? getLaterDate(
                          periodStart,
                          toUtcDate(employee.hire_date)
                      )
                    : periodStart;

                const employeeEnd = employee.date_exited
                    ? getEarlierDate(
                          periodEnd,
                          toUtcDate(employee.date_exited)
                      )
                    : periodEnd;

                if (employeeStart > employeeEnd) {
                    continue;
                }

                let totalMonthlyGross = new Prisma.Decimal(0);
                let totalPaye = new Prisma.Decimal(0);
                let totalAdditionalEarnings = new Prisma.Decimal(0);
                let totalPaidDays = 0;

                let weightedAnnualSalary = new Prisma.Decimal(0);
                let weightedAnnualBasicSalary = new Prisma.Decimal(0);

                const componentSnapshots: {
                    name: string;
                    percentage: Prisma.Decimal;
                    annualAmount: Prisma.Decimal;
                    monthlyAmount: Prisma.Decimal;
                }[] = [];

                const earningSnapshots: {
                    name: string;
                    amount: Prisma.Decimal;
                    calculationType: EarningCalculationType;
                    percentage: Prisma.Decimal | null;
                    calculationBase: Prisma.Decimal | null;
                    calculationBaseType: CalculationBaseType | null;
                    frequency: EarningFrequency;
                }[] = [];

                let previousSegmentEnd: Date | null = null;

                // 5. Process each salary structure
                // effective during this payroll period.
                for (const salary of employee.salaries) {
                    const segmentStart = getLaterDate(
                        employeeStart,
                        toUtcDate(salary.effectiveDate)
                    );

                    const segmentEnd = salary.endDate
                        ? getEarlierDate(
                              employeeEnd,
                              toUtcDate(salary.endDate)
                          )
                        : employeeEnd;

                    if (segmentStart > segmentEnd) {
                        continue;
                    }

                    // Prevent overlapping salary periods.
                    if (
                        previousSegmentEnd &&
                        segmentStart <= previousSegmentEnd
                    ) {
                        throw new AppError(
                            `Overlapping salary periods found for ${employee.first_name} ${employee.last_name}.`,
                            400,
                            "OVERLAPPING_SALARY_PERIODS"
                        );
                    }

                    const daysWorked = getDaysBetweenInclusive(
                        segmentStart,
                        segmentEnd
                    );

                    previousSegmentEnd = segmentEnd;
                    totalPaidDays += daysWorked;

                    const monthlyGross = prorateAmount(
                        salary.monthlyGross,
                        daysWorked,
                        daysInMonth
                    );

                    const paye = prorateAmount(
                        salary.paye,
                        daysWorked,
                        daysInMonth
                    );

                    totalMonthlyGross =
                        totalMonthlyGross.plus(monthlyGross);

                    totalPaye = totalPaye.plus(paye);

                    weightedAnnualSalary =
                        weightedAnnualSalary.plus(
                            prorateAmount(
                                salary.annualBaseSalary,
                                daysWorked,
                                daysInMonth
                            )
                        );

                    // 6. Calculate annual basic salary.
                    const basicComponent = salary.components.find(
                        (component) =>
                            component.name
                                .trim()
                                .toLowerCase()
                                .includes("basic")
                    );

                    if (basicComponent) {
                        weightedAnnualBasicSalary =
                            weightedAnnualBasicSalary.plus(
                                prorateAmount(
                                    basicComponent.annualAmount,
                                    daysWorked,
                                    daysInMonth
                                )
                            );
                    }

                    // 7. Snapshot salary components.
                    for (const component of salary.components) {
                        const monthlyComponent = component.annualAmount
                            .div(12)
                            .mul(daysWorked)
                            .div(daysInMonth)
                            .toDecimalPlaces(2);

                        componentSnapshots.push({
                            name: component.name,
                            percentage: component.percentage,
                            annualAmount: component.annualAmount,
                            monthlyAmount: monthlyComponent,
                        });
                    }

                    // 8. Include monthly recurring earnings only.
                    for (const earning of salary.additionalEarnings) {
                        if (
                            earning.frequency !==
                            EarningFrequency.MONTHLY
                        ) {
                            continue;
                        }

                        const amount = prorateAmount(
                            earning.amount,
                            daysWorked,
                            daysInMonth
                        );

                        totalAdditionalEarnings =
                            totalAdditionalEarnings.plus(amount);

                        earningSnapshots.push({
                            name: earning.name,
                            amount,
                            calculationType: earning.calculationType,
                            percentage: earning.percentage,
                            calculationBase: earning.calculationBase,
                            calculationBaseType:
                                earning.calculationBaseType,
                            frequency: EarningFrequency.MONTHLY,
                        });
                    }
                }

                if (totalPaidDays === 0) {
                    continue;
                }

                // 9. Calculate annual salary figures.
                const annualBaseSalary = weightedAnnualSalary
                    .mul(daysInMonth)
                    .div(totalPaidDays)
                    .toDecimalPlaces(2);

                const annualBasicSalary = weightedAnnualBasicSalary
                    .mul(daysInMonth)
                    .div(totalPaidDays)
                    .toDecimalPlaces(2);

                // 10. Calculate December 13th Month.
                if (payroll.month === 12) {
                    const existingPayment =
                        await tx.annualEarningPayment.findUnique({
                            where: {
                                employeeId_type_year: {
                                    employeeId: employee.id,
                                    type: AnnualEarningType.THIRTEENTH_MONTH,
                                    year: payroll.year,
                                },
                            },
                        });

                    // Never include an annual earning
                    // that has already been paid.
                    if (
                        existingPayment?.status !==
                        AnnualEarningStatus.PAID
                    ) {
                        const thirteenthMonthAmount =
                            annualBasicSalary
                                .mul(THIRTEENTH_MONTH_RATE)
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
                                        type: AnnualEarningType.THIRTEENTH_MONTH,
                                        year: payroll.year,
                                        amount: thirteenthMonthAmount,
                                        status: AnnualEarningStatus.PENDING,
                                        payrollId,
                                    },
                                });
                            }

                            totalAdditionalEarnings =
                                totalAdditionalEarnings.plus(
                                    thirteenthMonthAmount
                                );

                            earningSnapshots.push({
                                name: "13th Month",
                                amount: thirteenthMonthAmount,
                                calculationType:
                                    EarningCalculationType.PERCENTAGE,
                                percentage: THIRTEENTH_MONTH_RATE,
                                calculationBase: annualBasicSalary,
                                calculationBaseType:
                                    CalculationBaseType.BASIC_SALARY,
                                frequency: EarningFrequency.ANNUAL,
                            });
                        }
                    }
                }

                // 11. Calculate employee gross and net pay.
                const otherDeductions = new Prisma.Decimal(0);

                const grossPay = totalMonthlyGross.plus(
                    totalAdditionalEarnings
                );

                const netPay = grossPay
                    .minus(totalPaye)
                    .minus(otherDeductions)
                    .toDecimalPlaces(2);

                employeeSnapshots.push({
                    employeeId: employee.id,
                    employeeName: [
                        employee.first_name,
                        employee.middle_name,
                        employee.last_name,
                    ]
                        .filter(Boolean)
                        .join(" "),
                    employeeNumber: employee.employee_code,
                    employeeEmail: employee.email,
                    jobTitle: employee.job_title,
                    departmentNames: [
                        ...new Set(
                            employee.departments.map(
                                ({ department }) => department.name
                            )
                        ),
                    ],
                    annualBaseSalary,
                    monthlyGross: totalMonthlyGross,
                    additionalEarnings: totalAdditionalEarnings,
                    grossPay,
                    paye: totalPaye,
                    otherDeductions,
                    netPay,
                    components: componentSnapshots,
                    earnings: earningSnapshots,
                });
            }

            if (employeeSnapshots.length === 0) {
                throw new AppError(
                    "No eligible employees with applicable salary structures were found for this payroll period.",
                    400,
                    "NO_ELIGIBLE_EMPLOYEES"
                );
            }

            // 12. Clear previous calculated snapshots.
            await tx.payrollEmployeeComponent.deleteMany({
                where: {
                    payrollEmployee: {
                        payrollId,
                    },
                },
            });

            await tx.payrollEmployeeEarning.deleteMany({
                where: {
                    payrollEmployee: {
                        payrollId,
                    },
                },
            });

            await tx.monthlyPayrollEmployee.deleteMany({
                where: {
                    payrollId,
                },
            });

            // 13. Save employee payroll snapshots.
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

            // 14. Calculate payroll totals.
            const totals = employeeSnapshots.reduce(
                (result, employee) => ({
                    totalGross: result.totalGross.plus(
                        employee.grossPay
                    ),
                    totalEarnings: result.totalEarnings.plus(
                        employee.additionalEarnings
                    ),
                    totalPaye: result.totalPaye.plus(employee.paye),
                    totalDeductions: result.totalDeductions.plus(
                        employee.otherDeductions
                    ),
                    totalNetPay: result.totalNetPay.plus(employee.netPay),
                }),
                {
                    totalGross: new Prisma.Decimal(0),
                    totalEarnings: new Prisma.Decimal(0),
                    totalPaye: new Prisma.Decimal(0),
                    totalDeductions: new Prisma.Decimal(0),
                    totalNetPay: new Prisma.Decimal(0),
                }
            );

            // 15. Update payroll summary.
            const updatedPayroll = await tx.monthlyPayroll.update({
                where: {
                    id: payrollId,
                },
                data: {
                    status: "CALCULATED",
                    totalEmployees: employeeSnapshots.length,
                    totalGross: totals.totalGross,
                    totalEarnings: totals.totalEarnings,
                    totalPaye: totals.totalPaye,
                    totalDeductions: totals.totalDeductions,
                    totalNetPay: totals.totalNetPay,
                },
                include: {
                    employees: {
                        include: {
                            components: true,
                            earnings: true,
                        },
                    },
                },
            });

            return updatedPayroll;
        },
        {
            maxWait: 10000,
            timeout: 30000,
        }
    );
};
