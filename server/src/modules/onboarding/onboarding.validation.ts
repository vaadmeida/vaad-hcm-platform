import { z } from "zod";

export const createOnboardingMaterialSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must not exceed 200 characters"),

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters")
    .optional(),

  type: z.enum(["DOCUMENT", "VIDEO"]).default("DOCUMENT"),

  sortOrder: z.coerce
    .number()
    .int("Sort order must be a whole number")
    .min(0, "Sort order cannot be negative")
    .optional(),
});

export type CreateOnboardingMaterialInput = z.infer<
  typeof createOnboardingMaterialSchema
>;


export const updateOnboardingMaterialSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(200, "Title must not exceed 200 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .max(500, "Description must not exceed 500 characters")
    .optional(),

  type: z.enum(["DOCUMENT", "VIDEO"]).optional(),

  sortOrder: z.coerce
    .number()
    .int("Sort order must be a whole number")
    .min(0, "Sort order cannot be negative")
    .optional(),

  isActive: z
    .string()
    .transform((value) => value === "true")
    .optional(),
});


export type UpdateOnboardingMaterialInput = z.infer<
  typeof updateOnboardingMaterialSchema
>;

