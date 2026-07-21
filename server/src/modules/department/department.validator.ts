import { z } from "zod";

export const createDepartmentSchema = z.object({
  name: z.string().trim().min(2, "Department name must be at least 2 characters.")
 .max(255, "Department name cannot exceed 255 characters."),
  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters.")
    .optional(),
  status: z.enum(["active", "inactive"]).default("active"),
});

export type CreateDepartmentDto = z.infer<typeof createDepartmentSchema>;