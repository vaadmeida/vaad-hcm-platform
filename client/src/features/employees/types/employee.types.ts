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
    role: string;
    status: string;
    employment_type: string;
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
  email: string;
  phone: string | null;
  role: string;
  status: string;
  job_title: string | null;
  employment_type: string;
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

