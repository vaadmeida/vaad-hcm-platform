export type EmployeeRole =
    | "employee"
    | "manager"
    | "hr"
    | "admin";

export type EmployeeStatus =
    | "active"
    | "inactive"
    | "probation";

export type EmploymentType =
    | "full-time"
    | "part-time"
    | "contract"
    | "intern";

export interface Employee {
  id: string;
  employee_code: string | null;
  full_name: string;
  avatar_url: string | null;
  personal: {
    first_name: string;
    last_name: string;
    email: string;
    gender: string | null;
    date_of_birth: string | null;
    nationality: string | null;
    phone: string | null;
    alternate_phone: string | null;
    residential_address: string | null;
    city: string | null;
    state_of_residence: string | null;
  };
  employment: {
    job_title: string | null;
    job_description: string | null;
    role: EmployeeRole;
    status: EmployeeStatus;
    employment_type: EmploymentType;
    hire_date: string | null;
    probation_end_date: string | null;
    date_exited: string | null;
    work_email: string | null;
    owns_personal_computer: boolean;
    department: {
      id: string;
      name: string;
    } | null;
    manager: {
      id: string;
      name: string;
    } | null;
  };
  emergency_contact: {
    name: string | null;
    relationship: string | null;
    phone: string | null;
  };
  payroll: {
    paye_id: string | null;
    bank_name: string | null;
    account_number: string | null;
    account_name: string | null;
  };
  created_at: string;
  updated_at: string;
}

export interface EmployeeListItem {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url?: string | null;
  email: string;
  phone: string | null;
  role: EmployeeRole;
  status: EmployeeStatus;
  job_title: string | null;
  employment_type: EmploymentType;
  hire_date: string;
  created_at: string;
  department: {
    id: string;
    name: string;
  } | null;

  manager: {
    id: string;
    name: string;
  } | null;
}

export interface EmployeeListResponse {
  success: boolean;
  count: number;
  data: EmployeeListItem[];
}

export interface EmployeeFormValues {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  department_id: string;
  manager_id?: string;
  role: "admin" | "hr" | "manager" | "employee";
  status: "active" | "probation" | "inactive";
  job_title: string;
  employment_type:
    | "full-time"
    | "part-time"
    | "contract"
    | "intern";
  hire_date: string;
  avatar?: File | null;
  password: string;
}

export interface CreateEmployeePayload {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  job_title?: string;
  hire_date?: string;
}

export interface CreateEmployeeResponse {
  success: boolean;
  message: string;
  data: Employee;
}

export interface EmployeeFilters {
  search?: string;
  department?: string;
  status?: string;
}

export interface EmployeeResponse {
  success: boolean;
  data: Employee;
}

export interface UpdateEmployeeDTO {
    first_name?: string;
    last_name?: string;

    gender?: string;
    date_of_birth?: string;
    nationality?: string;

    phone?: string;
    alternate_phone?: string;
    email?: string;

    residential_address?: string;
    city?: string;
    state_of_residence?: string;

    emergency_contact_name?: string;
    emergency_contact_relationship?: string;
    emergency_contact_number?: string;

    role?: "employee" | "manager" | "hr" | "admin";

    job_title?: string;
    job_description?: string;

    department_id?: string;
    manager_id?: string;

    work_email?: string;

    status?: "active" | "inactive" | "probation" | "terminated";

    employment_type?:
        | "full-time"
        | "part-time"
        | "contract"
        | "intern";

    hire_date?: string;
    probation_end_date?: string;
    date_exited?: string;

    owns_personal_computer?: boolean;

    paye_id?: string;
    bank_name?: string;
    account_number?: string;
    account_name?: string;
}

export interface Manager {
  id: string;
  first_name: string;
  last_name: string;
  job_title: string | null;
  role: "manager";
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}