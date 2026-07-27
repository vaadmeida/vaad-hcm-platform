import { z } from "zod";

export const createEmployeeSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.email(),
  phone: z.string().optional(),
  job_title: z.string().optional(),
  hire_date: z.string().optional(),
});

export const updateEmployeeSchema = z.object({
  first_name: z.string().min(2).optional(),
  last_name: z.string().min(2).optional(),
  role: z.enum(["employee", "manager","hr","admin"]).optional(),
  phone: z.string().optional(),
  job_title: z.string().optional(),
  job_description: z.string().optional(),
  department_id: z.string().optional(),
  manager_id: z.string().optional(),
  work_email: z.string().email().optional(),
  status: z.enum(["active", "inactive", "probation"]).optional(),
  employment_type: z.enum([
    "full-time",
    "part-time",
    "contract",
    "intern"
  ]).optional(),
  hire_date: z.string().optional(),
  owns_personal_computer: z.boolean().optional()
});

export type UpdateEmployeeDTO = z.infer<typeof updateEmployeeSchema>;

export const getEmployeeSchema = z.object({
  id: z.uuid("Invalid employee ID"),
});

export const getAllEmployeesSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  department: z.string().optional(),
  status: z.string().optional(),
});