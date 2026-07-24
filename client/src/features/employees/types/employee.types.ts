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