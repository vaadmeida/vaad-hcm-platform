import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma.ts";
import { AppError } from "../../errors/appError.ts";
import { CreateSalaryInput, UpdateSalaryInput } from "./salary.validator.ts";
import { getPresignedUrl } from "../../config/storage.ts";
import { EmployeeSalaryFilters } from "./salary.types.ts";



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
  // Confirm employee exists
  const employee = await prisma.employee.findUnique({
    where: {
      id: employeeId,
    },
  });

  if (!employee) {
    throw new AppError(
      "Employee not found.",
      404,
      "EMPLOYEE_NOT_FOUND"
    );
  }

  // Prevent multiple active salary structures
  const existingSalary = await prisma.employeeSalary.findFirst({
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

  const salary = await prisma.$transaction(async (tx) => {
    const employeeSalary = await tx.employeeSalary.create({
      data: {
        employeeId,
        annualBaseSalary: data.annualBaseSalary,
        effectiveDate: data.effectiveDate,
        monthlyGross: data.monthlyGross,
        paye: data.paye,
        netPay: data.netPay,

        components: {
          create: data.components.map((component) => ({
            name: component.name,
            percentage: component.percentage,
            annualAmount: component.annualAmount,
          })),
        },

        additionalEarnings: {
          create: data.additionalEarnings.map((earning) => ({
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

export const updateEmployeeSalary = async (
  employeeId: string,
  data: UpdateSalaryInput
) => {
  const employee = await prisma.employee.findUnique({
    where: {
      id: employeeId,
    },
  });

  if (!employee) {
    throw new AppError(
      "Employee not found.",
      404,
      "EMPLOYEE_NOT_FOUND"
    );
  }

  const existingSalary = await prisma.employeeSalary.findFirst({
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

  const salary = await prisma.$transaction(async (tx) => {
    
    const updateData: Prisma.EmployeeSalaryUpdateInput = {};

    if (data.annualBaseSalary !== undefined) {
      updateData.annualBaseSalary = data.annualBaseSalary;
    }

    if (data.effectiveDate !== undefined) {
      updateData.effectiveDate = data.effectiveDate;
    }

    if (data.monthlyGross !== undefined) {
      updateData.monthlyGross = data.monthlyGross;
    }

    if (data.paye !== undefined) {
      updateData.paye = data.paye;
    }

    if (data.netPay !== undefined) {
      updateData.netPay = data.netPay;
    }

    await tx.employeeSalary.update({
      where: {
        id: existingSalary.id,
      },
      data: updateData,
    });

    if (data.components !== undefined) {
      await tx.salaryComponent.deleteMany({
        where: {
          salaryId: existingSalary.id,
        },
      });

      if (data.components.length > 0) {
        await tx.salaryComponent.createMany({
          data: data.components.map((component) => ({
            salaryId: existingSalary.id,
            name: component.name,
            percentage: component.percentage,
            annualAmount: component.annualAmount,
          })),
        });
      }
    }

    if (data.additionalEarnings !== undefined) {
      await tx.additionalEarning.deleteMany({
        where: {
          salaryId: existingSalary.id,
        },
      });

      if (data.additionalEarnings.length > 0) {
        await tx.additionalEarning.createMany({
          data: data.additionalEarnings.map((earning) => ({
            salaryId: existingSalary.id,
            name: earning.name,
            amount: earning.amount,
            frequency: earning.frequency,
          })),
        });
      }
    }

    return tx.employeeSalary.findUnique({
      where: {
        id: existingSalary.id,
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
  });

  return salary;
};