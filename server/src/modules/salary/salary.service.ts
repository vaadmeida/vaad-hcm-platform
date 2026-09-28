import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma.ts";
import { AppError } from "../../errors/appError.ts";
import { CreateSalaryInput, UpdateSalaryInput } from "./salary.validator.ts";

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