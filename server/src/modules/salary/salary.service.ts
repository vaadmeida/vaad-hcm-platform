import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma.ts";
import { getPresignedUrl } from "../../config/storage.ts";
import { AppError } from "../../errors/appError.ts";
import { calculateSalary } from "./salary.calculation.ts";
import { EmployeeSalaryFilters } from "./salary.types.ts";
import { CreateSalaryInput, SalaryReviewInput } from "./salary.validator.ts";


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

  // 3. Perform checks and create salary records atomically.
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
          create: calculatedSalary.additionalEarnings.map((earning) => ({
            name: earning.name,
            amount: earning.amount,
            frequency: earning.frequency,
          })),
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

        // 2. Get the employee's current active salary.
        const existingSalary = await tx.employeeSalary.findFirst({
            where: {
                employeeId,
                endDate: null,
            },
        });

        if (!existingSalary) {
            throw new AppError(
                "Salary structure not found for this employee.",
                404,
                "SALARY_STRUCTURE_NOT_FOUND"
            );
        }

        // 3. Determine the new salary values.
        const annualBaseSalary =
            data.annualBaseSalary ??
            Number(existingSalary.annualBaseSalary);

        const paye =
            data.paye ??
            Number(existingSalary.paye);

        const effectiveDate = data.effectiveDate;

        // 4. Ensure the new effective date is after the existing one.
        if (effectiveDate <= existingSalary.effectiveDate) {
            throw new AppError(
                "New salary effective date must be after the current salary effective date.",
                400,
                "INVALID_EFFECTIVE_DATE"
            );
        }

        // 5. Calculate the new salary structure.
        const calculatedSalary = calculateSalary({
            annualBaseSalary,
            paye,
        });

        // 6. Close the previous salary record.
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

        // 7. Create a completely new salary record.
        const newSalary = await tx.employeeSalary.create({
            data: {
                employeeId,
                annualBaseSalary: calculatedSalary.annualBaseSalary,
                effectiveDate,
                monthlyGross: calculatedSalary.monthlyGross,
                paye: calculatedSalary.paye,
                netPay: calculatedSalary.netPay,

                components: {
                    create: calculatedSalary.components.map(
                        (component) => ({
                            name: component.name,
                            percentage: component.percentage,
                            annualAmount: component.annualAmount,
                        })
                    ),
                },

                additionalEarnings: {
                    create: calculatedSalary.additionalEarnings.map(
                        (earning) => ({
                            name: earning.name,
                            amount: earning.amount,
                            frequency: earning.frequency,
                        })
                    ),
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