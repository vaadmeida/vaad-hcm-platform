import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma.ts";
import { getPresignedUrl } from "../../config/storage.ts";
import { AppError } from "../../errors/appError.ts";
import { calculateSalary } from "./salary.calculation.ts";
import { AdditionalEarningFrequency, CalculationBaseType, EmployeeSalaryFilters } from "./salary.types.ts";
import { CreateSalaryInput, SalaryReviewInput } from "./salary.validator.ts";


const resolveCalculationBase = (
  calculationBaseType: CalculationBaseType,
  calculatedSalary: ReturnType<typeof calculateSalary>,
  frequency: AdditionalEarningFrequency,
  customBase?: number
): Prisma.Decimal => {
  // Custom amount is already entered in the selected frequency.
  if (calculationBaseType === "CUSTOM_AMOUNT") {
    if (customBase == null || customBase <= 0) {
      throw new AppError(
        "A valid custom calculation base is required.",
        400,
        "INVALID_CUSTOM_CALCULATION_BASE"
      );
    }

    return new Prisma.Decimal(customBase.toString());
  }

  let annualBase: Prisma.Decimal;

  switch (calculationBaseType) {
    case "GROSS_SALARY":
      annualBase = calculatedSalary.annualBaseSalary;
      break;

    case "BASIC_SALARY":
    case "HOUSING_ALLOWANCE":
    case "TRANSPORT_ALLOWANCE":
    case "MEDICAL_ALLOWANCE":
    case "MEAL_ALLOWANCE":
    case "WARDROBE_ALLOWANCE": {
      const componentNames: Record<string, string> = {
        BASIC_SALARY: "Basic Salary",
        HOUSING_ALLOWANCE: "Housing Allowance",
        TRANSPORT_ALLOWANCE: "Transport Allowance",
        MEDICAL_ALLOWANCE: "Medical Allowance",
        MEAL_ALLOWANCE: "Meal Allowance",
        WARDROBE_ALLOWANCE: "Wardrobe Allowance",
      };

      const component = calculatedSalary.components.find(
        (item) => item.name === componentNames[calculationBaseType]
      );

      if (!component) {
        throw new AppError(
          "Selected salary component was not found.",
          400,
          "CALCULATION_BASE_NOT_FOUND"
        );
      }

      annualBase = component.annualAmount;
      break;
    }

    default:
      throw new AppError(
        "Invalid calculation base type.",
        400,
        "INVALID_CALCULATION_BASE_TYPE"
      );
  }

  // Annual uses annual values.
  // Monthly and One-Time use monthly equivalents.
  if (frequency === "ANNUAL") {
    return annualBase;
  }

  return annualBase.div(12).toDecimalPlaces(2);
};


export const getEmployeesWithSalary = async ({
  page = 1,
  search = "",
  department = "all",
  salaryStatus = "all",
}: EmployeeSalaryFilters = {}) => {
  const limit = 7;
  const skip = (page - 1) * limit;

  // Build employee filters
  const where: Prisma.EmployeeWhereInput = {
    AND: [
      // Search filter
      ...(search.trim()
        ? [
          {
            OR: [
              {
                first_name: {
                  contains: search.trim(),
                  mode: "insensitive" as const,
                },
              },
              {
                middle_name: {
                  contains: search.trim(),
                  mode: "insensitive" as const,
                },
              },
              {
                last_name: {
                  contains: search.trim(),
                  mode: "insensitive" as const,
                },
              },
              {
                employee_code: {
                  contains: search.trim(),
                  mode: "insensitive" as const,
                },
              },
              {
                email: {
                  contains: search.trim(),
                  mode: "insensitive" as const,
                },
              },
            ],
          },
        ]
        : []),

      // Department filter
      ...(department !== "all"
        ? [
          {
            departments: {
              some: {
                department: {
                  is: {
                    id: department,
                  },
                },
              },
            },
          },
        ]
        : []),

      // Salary status filter
      ...(salaryStatus === "ACTIVE"
        ? [
          {
            salaries: {
              some: {
                endDate: null,
              },
            },
          },
        ]
        : salaryStatus === "ENDED"
          ? [
            {
              salaries: {
                some: {},
                none: {
                  endDate: null,
                },
              },
            },
          ]
          : salaryStatus === "NOT_CONFIGURED"
            ? [
              {
                salaries: {
                  none: {},
                },
              },
            ]
            : []),
    ],
  };

  const [employees, total] = await Promise.all([
    prisma.employee.findMany({
      where,
      skip,
      take: limit,

      orderBy: [
        { first_name: "asc" },
        { last_name: "asc" },
      ],

      select: {
        id: true,
        first_name: true,
        middle_name: true,
        last_name: true,
        employee_code: true,
        avatar_url: true,
        job_title: true,
        status: true,

        departments: {
          select: {
            department: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },

        salaries: {
          orderBy: {
            effectiveDate: "desc",
          },
          take: 1,
          select: {
            id: true,
            annualBaseSalary: true,
            monthlyGross: true,
            paye: true,
            netPay: true,
            effectiveDate: true,
            endDate: true,
          },
        },
      },
    }),

    prisma.employee.count({
      where,
    }),
  ]);

  const data = await Promise.all(
    employees.map(async (employee) => {
      const latestSalary = employee.salaries[0] ?? null;

      const isActiveSalary =
        latestSalary !== null && latestSalary.endDate === null;

      const salaryStatus = isActiveSalary
        ? "ACTIVE"
        : latestSalary
          ? "ENDED"
          : "NOT_CONFIGURED";

      const avatarUrl = employee.avatar_url
        ? await getPresignedUrl(employee.avatar_url)
        : null;

      return {
        employeeId: employee.id,

        firstName: employee.first_name,
        middleName: employee.middle_name,
        lastName: employee.last_name,

        employeeName: [
          employee.first_name,
          employee.middle_name,
          employee.last_name,
        ]
          .filter(Boolean)
          .join(" "),

        employeeCode: employee.employee_code,
        avatarUrl,
        jobTitle: employee.job_title,
        employmentStatus: employee.status,

        departments: employee.departments.map(({ department }) => ({
          id: department.id,
          name: department.name,
        })),

        salary: isActiveSalary && latestSalary
          ? {
            id: latestSalary.id,
            annualBaseSalary: Number(latestSalary.annualBaseSalary),
            monthlyGross: Number(latestSalary.monthlyGross),
            paye: Number(latestSalary.paye),
            netPay: Number(latestSalary.netPay),
            effectiveDate: latestSalary.effectiveDate,
          }
          : null,

        salaryStatus,
      };
    })
  );

  return {
    data,

    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page * limit < total,
      hasPreviousPage: page > 1,
    },
  };
};

export const getEmployeeSalary = async (employeeId: string) => {


  const salary = await prisma.employeeSalary.findFirst({
    where: {
      employeeId,
      endDate: null,
    },
    include: {
      components: {
        orderBy: {
          percentage: "desc",
        },
      },
      additionalEarnings: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!salary) {
    throw new AppError(
      "Salary structure not found for this employee.",
      404,
      "SALARY_STRUCTURE_NOT_FOUND"
    );
  }

  return salary;
}


export const createEmployeeSalary = async (
  employeeId: string,
  data: CreateSalaryInput
) => {
  // 1. Calculate salary values on the backend.
  const calculatedSalary = calculateSalary({
    annualBaseSalary: data.annualBaseSalary,
    paye: data.paye,
  });

  // 2. Ensure PAYE does not exceed monthly gross.
  if (calculatedSalary.paye.greaterThan(calculatedSalary.monthlyGross)) {
    throw new AppError(
      "PAYE cannot exceed the employee's monthly gross salary.",
      400,
      "INVALID_PAYE"
    );
  }

  // 3. Calculate HR-created additional earnings.
  const customEarnings = (data.additionalEarnings ?? []).map((earning) => {
    if (earning.calculationType === "FIXED") {
      if (
        earning.amount == null ||
        !Number.isFinite(earning.amount) ||
        earning.amount < 0
      ) {
        throw new AppError(
          `Invalid amount for ${earning.name}.`,
          400,
          "INVALID_EARNING_AMOUNT"
        );
      }

      return {
        name: earning.name,
        amount: new Prisma.Decimal(earning.amount.toString()),
        calculationType: "FIXED" as const,
        percentage: null,
        calculationBase: null,
        calculationBaseType: null,
        frequency: earning.frequency,
      };
    }

    // Validate percentage configuration.
    if (
      earning.percentage == null ||
      !Number.isFinite(earning.percentage) ||
      earning.percentage <= 0 ||
      earning.percentage > 100 ||
      !earning.calculationBaseType
    ) {
      throw new AppError(
        `Invalid percentage configuration for ${earning.name}.`,
        400,
        "INVALID_PERCENTAGE_EARNING"
      );
    }

    const calculationBase = resolveCalculationBase(
      earning.calculationBaseType,
      calculatedSalary,
      earning.frequency,
      earning.calculationBase ?? undefined
    );

    const amount = calculationBase
      .mul(earning.percentage)
      .div(100)
      .toDecimalPlaces(2);

    return {
      name: earning.name,
      amount,
      calculationType: "PERCENTAGE" as const,
      percentage: new Prisma.Decimal(earning.percentage.toString()),
      calculationBase,
      calculationBaseType: earning.calculationBaseType,
      frequency: earning.frequency,
    };
  });

  // 4. Get annual Basic Salary for system-generated earnings.
  const basicSalary = calculatedSalary.components.find(
    (component) => component.name === "Basic Salary"
  );

  if (!basicSalary) {
    throw new AppError(
      "Basic salary component not found.",
      400,
      "BASIC_SALARY_NOT_FOUND"
    );
  }

  // 5. Map system-generated earnings with percentage metadata.
  const systemEarnings = calculatedSalary.additionalEarnings.map(
    (earning) => {
      const percentage =
        earning.name === "Leave Allowance"
          ? 10
          : earning.name === "13th Month"
            ? 15
            : null;

      if (percentage === null) {
        throw new AppError(
          `Unknown system-generated earning: ${earning.name}.`,
          400,
          "UNKNOWN_SYSTEM_EARNING"
        );
      }

      return {
        name: earning.name,
        amount: earning.amount,
        calculationType: "PERCENTAGE" as const,
        percentage: new Prisma.Decimal(percentage.toString()),
        calculationBase: basicSalary.annualAmount,
        calculationBaseType: "BASIC_SALARY" as const,
        frequency: earning.frequency,
      };
    }
  );

  // 6. Combine system-generated and HR-created earnings.
  const allAdditionalEarnings = [
    ...systemEarnings,
    ...customEarnings,
  ];

  // 7. Perform checks and create salary records atomically.
  const salary = await prisma.$transaction(async (tx) => {
    // Confirm employee exists.
    const employee = await tx.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new AppError(
        "Employee not found.",
        404,
        "EMPLOYEE_NOT_FOUND"
      );
    }

    // Prevent salary creation for employees who have exited.
    const exitStatuses = ["resigned", "terminated", "dismissed"];

    if (exitStatuses.includes(employee.status)) {
      throw new AppError(
        "Cannot create a salary structure for an employee who has exited.",
        400,
        "EMPLOYEE_HAS_EXITED"
      );
    }

    // Prevent multiple active salary structures.
    const existingSalary = await tx.employeeSalary.findFirst({
      where: {
        employeeId,
        endDate: null,
      },
    });

    if (existingSalary) {
      throw new AppError(
        "Employee already has an active salary structure.",
        409,
        "ACTIVE_SALARY_EXISTS"
      );
    }

    // Create salary and related records.
    const employeeSalary = await tx.employeeSalary.create({
      data: {
        employeeId,
        annualBaseSalary: calculatedSalary.annualBaseSalary,
        effectiveDate: data.effectiveDate,
        monthlyGross: calculatedSalary.monthlyGross,
        paye: calculatedSalary.paye,
        netPay: calculatedSalary.netPay,

        components: {
          create: calculatedSalary.components.map((component) => ({
            name: component.name,
            percentage: component.percentage,
            annualAmount: component.annualAmount,
          })),
        },

        additionalEarnings: {
          create: allAdditionalEarnings,
        },
      },

      include: {
        components: {
          orderBy: {
            percentage: "desc",
          },
        },
        additionalEarnings: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return employeeSalary;
  });

  return salary;
};


export const EmployeeSalaryReview = async (
  employeeId: string,
  data: SalaryReviewInput
) => {
  const salary = await prisma.$transaction(async (tx) => {
    // 1. Confirm employee exists.
    const employee = await tx.employee.findUnique({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new AppError(
        "Employee not found.",
        404,
        "EMPLOYEE_NOT_FOUND"
      );
    }

    // 2. Prevent salary reviews for employees who have exited.
    const exitStatuses = ["resigned", "terminated", "dismissed"];

    if (exitStatuses.includes(employee.status)) {
      throw new AppError(
        "Cannot review the salary of an employee who has exited.",
        400,
        "EMPLOYEE_HAS_EXITED"
      );
    }

    // 3. Get the employee's current active salary.
    const existingSalary = await tx.employeeSalary.findFirst({
      where: {
        employeeId,
        endDate: null,
      },
      include: {
        additionalEarnings: true,
        components: true,
      },
    });

    if (!existingSalary) {
      throw new AppError(
        "Salary structure not found for this employee.",
        404,
        "SALARY_STRUCTURE_NOT_FOUND"
      );
    }

    // 4. Determine proposed salary values.
    const annualBaseSalary =
      data.annualBaseSalary ??
      Number(existingSalary.annualBaseSalary);

    const paye =
      data.paye ??
      Number(existingSalary.paye);

    const effectiveDate = data.effectiveDate;

    // 5. Validate effective date.
    if (effectiveDate <= existingSalary.effectiveDate) {
      throw new AppError(
        "New salary effective date must be after the current salary effective date.",
        400,
        "INVALID_EFFECTIVE_DATE"
      );
    }

    // 6. Calculate the proposed salary structure.
    const calculatedSalary = calculateSalary({
      annualBaseSalary,
      paye,
    });

    // 7. Ensure PAYE does not exceed monthly gross.
    if (calculatedSalary.paye.greaterThan(calculatedSalary.monthlyGross)) {
      throw new AppError(
        "PAYE cannot exceed the employee's monthly gross salary.",
        400,
        "INVALID_PAYE"
      );
    }

    // 8. Identify existing HR-created additional earnings.
    // System-generated earnings are recreated automatically.
    const existingCustomEarnings =
      existingSalary.additionalEarnings.filter(
        (earning) =>
          earning.name !== "Leave Allowance" &&
          earning.name !== "13th Month"
      );

    // 9. Use submitted earnings or preserve existing custom earnings.
    const earningsToProcess =
      data.additionalEarnings ??
      existingCustomEarnings.map((earning) => ({
        name: earning.name,
        calculationType: earning.calculationType,
        amount:
          earning.amount != null
            ? Number(earning.amount)
            : undefined,
        percentage:
          earning.percentage != null
            ? Number(earning.percentage)
            : undefined,
        calculationBaseType:
          earning.calculationBaseType ?? undefined,
        calculationBase:
          earning.calculationBase != null
            ? Number(earning.calculationBase)
            : undefined,
        frequency: earning.frequency,
      }));

    // 10. Recalculate HR-created additional earnings.
    const customEarnings = earningsToProcess.map((earning) => {
      if (earning.calculationType === "FIXED") {
        if (
          earning.amount == null ||
          !Number.isFinite(earning.amount) ||
          earning.amount < 0
        ) {
          throw new AppError(
            `Invalid amount for ${earning.name}.`,
            400,
            "INVALID_EARNING_AMOUNT"
          );
        }

        return {
          name: earning.name,
          amount: new Prisma.Decimal(earning.amount.toString()),
          calculationType: "FIXED" as const,
          percentage: null,
          calculationBase: null,
          calculationBaseType: null,
          frequency: earning.frequency,
        };
      }

      if (
        earning.percentage == null ||
        !Number.isFinite(earning.percentage) ||
        earning.percentage <= 0 ||
        earning.percentage > 100 ||
        !earning.calculationBaseType
      ) {
        throw new AppError(
          `Invalid percentage configuration for ${earning.name}.`,
          400,
          "INVALID_PERCENTAGE_EARNING"
        );
      }

      const calculationBase = resolveCalculationBase(
        earning.calculationBaseType,
        calculatedSalary,
        earning.frequency,
        earning.calculationBase ?? undefined
      );

      const amount = calculationBase
        .mul(earning.percentage)
        .div(100)
        .toDecimalPlaces(2);

      return {
        name: earning.name,
        amount,
        calculationType: "PERCENTAGE" as const,
        percentage: new Prisma.Decimal(
          earning.percentage.toString()
        ),
        calculationBase,
        calculationBaseType: earning.calculationBaseType,
        frequency: earning.frequency,
      };
    });

    // 11. Get annual Basic Salary for system-generated earnings.
    const basicSalary = calculatedSalary.components.find(
      (component) => component.name === "Basic Salary"
    );

    if (!basicSalary) {
      throw new AppError(
        "Basic salary component not found.",
        400,
        "BASIC_SALARY_NOT_FOUND"
      );
    }

    // 12. Recreate system-generated earnings with percentage metadata.
    const systemEarnings = calculatedSalary.additionalEarnings.map(
      (earning) => {
        const percentage =
          earning.name === "Leave Allowance"
            ? 10
            : earning.name === "13th Month"
              ? 15
              : null;

        if (percentage === null) {
          throw new AppError(
            `Unknown system-generated earning: ${earning.name}.`,
            400,
            "UNKNOWN_SYSTEM_EARNING"
          );
        }

        return {
          name: earning.name,
          amount: earning.amount,
          frequency: earning.frequency,
          calculationType: "PERCENTAGE" as const,
          percentage: new Prisma.Decimal(percentage.toString()),
          calculationBase: basicSalary.annualAmount,
          calculationBaseType: "BASIC_SALARY" as const,
        };
      }
    );

    // 13. Close the previous salary record.
    const previousEndDate = new Date(
      effectiveDate.getTime() - 1
    );

    await tx.employeeSalary.update({
      where: {
        id: existingSalary.id,
      },
      data: {
        endDate: previousEndDate,
      },
    });

    // 14. Create the new salary record.
    const newSalary = await tx.employeeSalary.create({
      data: {
        employeeId,
        annualBaseSalary: calculatedSalary.annualBaseSalary,
        effectiveDate,
        monthlyGross: calculatedSalary.monthlyGross,
        paye: calculatedSalary.paye,
        netPay: calculatedSalary.netPay,

        components: {
          create: calculatedSalary.components.map((component) => ({
            name: component.name,
            percentage: component.percentage,
            annualAmount: component.annualAmount,
          })),
        },

        additionalEarnings: {
          create: [
            ...systemEarnings,
            ...customEarnings,
          ],
        },
      },

      include: {
        components: {
          orderBy: {
            percentage: "desc",
          },
        },
        additionalEarnings: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    return newSalary;
  });

  return salary;
};

export const getEmployeeSalaryHistory = async (
  employeeId: string
) => {
  // 1. Confirm employee exists.
  const employee = await prisma.employee.findUnique({
    where: { id: employeeId },
    select: { id: true },
  });

  if (!employee) {
    throw new AppError(
      "Employee not found.",
      404,
      "EMPLOYEE_NOT_FOUND"
    );
  }

  // 2. Retrieve all salary records.
  const salaryHistory = await prisma.employeeSalary.findMany({
    where: {
      employeeId,
    },
    orderBy: {
      effectiveDate: "desc",
    },
    include: {
      components: {
        orderBy: {
          percentage: "desc",
        },
      },
      additionalEarnings: {
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  return salaryHistory;
};