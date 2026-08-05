export interface Department {
  id: string;
  name: string;
  description: string | null;
  status: "active" | "inactive";
  manager_id: string | null;
  manager: {
    id: string;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  } | null;
  employee_count: number;
  created_at: string;
  updated_at: string;
}