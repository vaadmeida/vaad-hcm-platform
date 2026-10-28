import { z } from "zod";

export const createEmployeeSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  email: z.email(),
  phone: z.string().optional(),
  job_title: z.string().optional(),
  hire_date: z.string().optional(),
});

const optionalDate = z.preprocess(
  (value) => (value === "" ? undefined : value),
  z.coerce.date().nullable().optional()
);

export const updateEmployeeSchema = z.object({
  // Personal information
  first_name: z.string().min(2).optional(),
  middle_name: z.string().max(100).optional(),
  last_name: z.string().min(2).optional(),
  gender: z.string().optional(),
  date_of_birth: optionalDate,
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


  // Next of Kin
  next_of_kin_name: z.string().max(150).optional(),
  next_of_kin_relationship: z.string().max(50).optional(),
  next_of_kin_phone: z.string().max(20).optional(),
  next_of_kin_email: z.email().max(255).optional(),
  next_of_kin_address: z.string().optional(),

  // Employment
  role: z.enum(["employee", "manager", "hr", "admin"]).optional(),
  job_title: z.string().optional(),
  job_description: z.string().optional(),

  department_ids: z.array(z.string().check(z.uuid())).optional(),
  manager_id: z.string().check(z.uuid()).optional(),
  work_email: z.email().optional().or(z.literal("")),

  status: z.enum(["active", "inactive","unconfirmed","resigned","dismissed","terminated"]).optional(),
  employment_type: z.enum(["full-time", "part-time", "contract", "intern"]).optional(),

  hire_date: optionalDate,
  probation_end_date: optionalDate,
  date_exited: optionalDate,

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
    search: z.string().optional(),
    department: z.string().optional(),
    status: z.string().optional(),
    page: z.coerce.number().int().min(1).optional(),
    limit: z.coerce.number().int().min(1).max(100).optional(),
});