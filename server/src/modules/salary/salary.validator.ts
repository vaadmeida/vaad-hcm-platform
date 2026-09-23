import { z } from "zod";

export const createSalarySchema = z.object({
  annualBaseSalary: z.coerce.number().positive(),
  effectiveDate: z.coerce.date(),
  monthlyGross: z.coerce.number().positive(),
  paye: z.coerce.number().min(0).default(0),
  netPay: z.coerce.number().positive(),
  components: z
    .array(
      z.object({
        name: z.string().min(1, "Component name is required"),
        percentage: z.number().min(0).max(100),
        annualAmount: z.number().min(0),
      })
    )
    .min(1, "At least one salary component is required")
    .refine(
      (components) => {
        const totalPercentage = components.reduce(
          (total, component) => total + component.percentage,
          0
        );
        return Math.abs(totalPercentage - 100) < 0.01;
      },
      {
        message: "Salary component percentages must total 100%.",
      }
    ),

  additionalEarnings: z
    .array(
      z.object({
        name: z.string().min(1, "Earning name is required"),
        amount: z.number().positive(),
        frequency: z.enum(["MONTHLY", "ANNUAL", "ONE_TIME"]),
      })
    )
    .optional()
    .default([]),
});

export type CreateSalaryInput = z.infer<typeof createSalarySchema>;