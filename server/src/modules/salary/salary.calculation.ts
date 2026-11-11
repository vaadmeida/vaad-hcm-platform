
import { Prisma } from "@prisma/client";
import { AppError } from "../../errors/appError.ts";

const SALARY_COMPONENT_POLICY = [
  { name: "Basic Salary", percentage: 22 },
  { name: "Housing Allowance", percentage: 20 },
  { name: "Transport Allowance", percentage: 20 },
  { name: "Medical Allowance", percentage: 18 },
  { name: "Meal Allowance", percentage: 10 },
  { name: "Wardrobe Allowance", percentage: 10 },
] as const;

interface CalculateSalaryInput {
  annualBaseSalary: number;
  paye: number;
}

export const calculateSalary = ({
  annualBaseSalary,
  paye,
}: CalculateSalaryInput) => {
  const annualBase = new Prisma.Decimal(annualBaseSalary.toString());
  const monthlyPaye = new Prisma.Decimal(paye.toString());

  // Calculate fixed salary components.
  const components = SALARY_COMPONENT_POLICY.map((component) => ({
    name: component.name,
    percentage: new Prisma.Decimal(component.percentage),
    annualAmount: annualBase
      .mul(component.percentage)
      .div(100)
      .toDecimalPlaces(2),
  }));

  // Get basic salary component.
  const basicSalary = components.find(
    (component) => component.name === "Basic Salary"
  );

  if (!basicSalary) {
    throw new AppError(
      "Basic salary component is missing from salary policy.",
      500,
      "BASIC_SALARY_COMPONENT_MISSING"
    );
  }

  // Calculate monthly gross.
  const monthlyGross = annualBase.div(12).toDecimalPlaces(2);

  // Validate PAYE.
  if (monthlyPaye.greaterThan(monthlyGross)) {
    throw new AppError(
      "PAYE cannot exceed monthly gross salary.",
      400,
      "INVALID_PAYE"
    );
  }

  // Calculate estimated monthly net pay.
  const netPay = monthlyGross
    .minus(monthlyPaye)
    .toDecimalPlaces(2);

  // Calculate system-generated additional earnings.
  const calculationBase = basicSalary.annualAmount;

  const additionalEarnings = [
    {
      name: "Leave Allowance",
      calculationType: "PERCENTAGE" as const,
      percentage: new Prisma.Decimal(10),
      calculationBase,
      amount: calculationBase
        .mul(10)
        .div(100)
        .toDecimalPlaces(2),
      frequency: "ANNUAL" as const,
    },
    {
      name: "13th Month",
      calculationType: "PERCENTAGE" as const,
      percentage: new Prisma.Decimal(15),
      calculationBase,
      amount: calculationBase
        .mul(15)
        .div(100)
        .toDecimalPlaces(2),
      frequency: "ANNUAL" as const,
    },
  ];

  return {
    annualBaseSalary: annualBase,
    monthlyGross,
    paye: monthlyPaye,
    netPay,
    components,
    additionalEarnings,
  };
};
