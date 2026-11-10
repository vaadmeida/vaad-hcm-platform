import { z } from "zod";

const moneySchema = z.coerce
  .number()
  .finite()
  .multipleOf(0.01, "Amount can have at most 2 decimal places");

export const createSalarySchema = z.object({
  
  annualBaseSalary: moneySchema.positive(
    "Annual base salary must be greater than zero"
  ),

  effectiveDate: z.coerce.date(),

  paye: moneySchema.min(0).default(0),

  performanceBonus: moneySchema.min(0).default(0),
});

export type CreateSalaryInput = z.infer<typeof createSalarySchema>;

export const salaryReviewSchema = z.object({
    annualBaseSalary: moneySchema.positive().optional(),
    effectiveDate: z.coerce.date(),
    paye: moneySchema.min(0).optional(),
}).refine(
    (data) =>
        data.annualBaseSalary !== undefined ||
        data.paye !== undefined,
    {
        message: "Provide a new annual base salary or PAYE amount.",
    }
);

export type SalaryReviewInput = z.infer<typeof salaryReviewSchema>;