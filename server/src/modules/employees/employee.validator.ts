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
    // Personal information
    first_name: z.string().min(2).optional(),
    last_name: z.string().min(2).optional(),
    gender: z.string().optional(),
    date_of_birth: z.string().optional(),
    nationality: z.string().optional(),
    phone: z.string().optional(),
    alternate_phone: z.string().optional(),
    email: z.email().optional(),
    residential_address: z.string().optional(),
    city: z.string().optional(),
    state_of_residence: z.string().optional(),

    // Emergency contact
    emergency_contact_name: z.string().optional(),
    emergency_contact_relationship: z.string().optional(),
    emergency_contact_number: z.string().optional(),

    // Employment
    role: z.enum(["employee", "manager", "hr", "admin"]).optional(),
    job_title: z.string().optional(),
    job_description: z.string().optional(),

    department_id: z.uuid().optional(),
    manager_id: z.uuid().optional(),
    work_email: z.email().optional(),

    status: z.enum(["active", "inactive", "probation"]).optional(),
    employment_type: z.enum(["full-time","part-time","contract","intern"]).optional(),

    hire_date: z.string().optional(),
    probation_end_date: z.string().optional(),
    date_exited: z.string().optional(),
    
    owns_personal_computer: z.boolean().optional(),

    // Payroll / bank
    paye_id: z.string().optional(),
    bank_name: z.string().optional(),
    account_number: z.string().optional(),
    account_name: z.string().optional(),
});

export type UpdateEmployeeDTO = z.infer<
    typeof updateEmployeeSchema
>;

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