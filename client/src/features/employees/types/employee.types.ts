export interface Employee {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  role: "admin" | "hr" | "manager" | "employee";
  status: "active" | "probation" | "inactive";
  job_title: string | null;
  employment_type:
    | "full-time"
    | "part-time"
    | "contract"
    | "intern";
  hire_date: string | null;
  created_at: string;
  avatar_url?: string
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
  data: Employee[];
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
  department_id?: string;
  role: "admin" | "hr" | "manager" | "employee";
  employment_type:
    | "full-time"
    | "part-time"
    | "contract"
    | "intern";
  hire_date?: string;
}