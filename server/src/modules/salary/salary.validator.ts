
import { z } from "zod";

const moneySchema = z.coerce
  .number()
  .finite()
  .multipleOf(0.01, "Amount can have at most 2 decimal places");


const calculationBaseTypeSchema = z.enum([
  "BASIC_SALARY",
  "GROSS_SALARY",
  "HOUSING_ALLOWANCE",
  "TRANSPORT_ALLOWANCE",
  "MEDICAL_ALLOWANCE",
  "MEAL_ALLOWANCE",
  "WARDROBE_ALLOWANCE",
  "CUSTOM_AMOUNT",
]);

const additionalEarningSchema = z
  .object({
    name: z.string().trim().min(1, "Earning name is required"),

    calculationType: z.enum(["FIXED", "PERCENTAGE"]),

    amount: moneySchema.min(0).optional(),

    percentage: z.coerce
      .number()
      .gt(0, "Percentage must be greater than zero")
      .max(100, "Percentage cannot exceed 100")
      .nullable()
      .optional(),

    calculationBaseType: calculationBaseTypeSchema
      .nullable()
      .optional(),

    // Only required when calculationBaseType is CUSTOM_AMOUNT.
    calculationBase: moneySchema
      .positive("Calculation base must be greater than zero")
      .nullable()
      .optional(),

    frequency: z.enum(["MONTHLY", "ANNUAL", "ONE_TIME"]),
  })
  .superRefine((earning, ctx) => {
    if (earning.calculationType === "FIXED") {
      if (earning.amount == null || earning.amount < 0) {
        ctx.addIssue({
          code: "custom",
          path: ["amount"],
          message: "A valid fixed amount is required",
        });
      }

      if (
        earning.percentage != null ||
        earning.calculationBaseType != null ||
        earning.calculationBase != null
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["calculationType"],
          message: "Fixed earnings cannot have percentage calculation details",
        });
      }
    }

    if (earning.calculationType === "PERCENTAGE") {
      if (earning.amount !== undefined) {
        ctx.addIssue({
          code: "custom",
          path: ["amount"],
          message: "Percentage earning amounts are calculated by the backend",
        });
      }

      if (earning.percentage == null) {
        ctx.addIssue({
          code: "custom",
          path: ["percentage"],
          message: "A valid percentage is required",
        });
      }

      if (earning.calculationBaseType == null) {
        ctx.addIssue({
          code: "custom",
          path: ["calculationBaseType"],
          message: "Select a calculation base",
        });
      }

      if (
        earning.calculationBaseType === "CUSTOM_AMOUNT" &&
        (earning.calculationBase == null || earning.calculationBase <= 0)
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["calculationBase"],
          message: "Enter a valid custom calculation base",
        });
      }

      if (
        earning.calculationBaseType != null &&
        earning.calculationBaseType !== "CUSTOM_AMOUNT" &&
        earning.calculationBase != null
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["calculationBase"],
          message: "The backend calculates this salary component automatically",
        });
      }
    }
  });

export const createSalarySchema = z.object({
  annualBaseSalary: moneySchema.positive(
    "Annual base salary must be greater than zero"
  ),

  effectiveDate: z.coerce.date(),

  paye: moneySchema.min(0).default(0),

  additionalEarnings: z
    .array(additionalEarningSchema)
    .default([]),
});

export type CreateSalaryInput = z.infer<typeof createSalarySchema>;

export const salaryReviewSchema = z.object({
  annualBaseSalary: moneySchema.positive().optional(),

  effectiveDate: z.coerce.date(),

  paye: moneySchema.min(0).optional(),

  additionalEarnings: z
    .array(additionalEarningSchema)
    .optional(),
}).refine(
  (data) =>
    data.annualBaseSalary !== undefined ||
    data.paye !== undefined ||
    data.additionalEarnings !== undefined,
  {
    message:
      "Provide a new annual base salary, PAYE amount, or additional earnings.",
  }
);

export type SalaryReviewInput = z.infer<typeof salaryReviewSchema>;
