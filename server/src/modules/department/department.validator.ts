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


export const updateDepartmentSchema = z.object({
  name: z
    .string()
    .min(2, "Department name must be at least 2 characters")
    .max(100, "Department name cannot exceed 100 characters")
    .optional(),

  description: z
    .string()
    .max(500, "Description cannot exceed 500 characters")
    .nullable()
    .optional(),

  status: z.enum(["active", "inactive"]).optional(),
  manager_id: z.uuid("Invalid manager ID").nullable().optional(),
});

export type UpdateDepartmentDto = z.infer<typeof updateDepartmentSchema>;

export const assignDepartmentManagerSchema = z
  .object({
    manager_id: z.string().uuid("Invalid manager ID"),
  })
  .strict();

export type AssignDepartmentManagerDto = z.infer<
  typeof assignDepartmentManagerSchema
>;