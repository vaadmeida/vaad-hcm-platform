import prisma from "../../config/prisma.ts";
import { AppError } from "../../errors/appError.ts";
import { CreateSalaryInput } from "./salary.validator.ts";

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