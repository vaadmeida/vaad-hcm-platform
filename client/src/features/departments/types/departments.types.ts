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

export interface UpdateDepartmentDto {
  name?: string;
  description?: string | null;
  status?: "active" | "inactive";
}

export interface AssignDepartmentManagerDto {
  manager_id: string;
}

export interface TeamMember {
  id: string;
  first_name: string;
  last_name: string;
  job_title: string | null;
  avatar_url: string | null;
  status: "active" | "inactive";
}

export interface DepartmentTeam {
  manager: {
    id: string;
    first_name: string;
    last_name: string;
    job_title: string | null;
    avatar_url: string | null;
    status: string | null
  } | null;
  members: TeamMember[];
}

export interface ActivityUser {
  id: string;
  first_name: string;
  last_name: string;
}

export type ActivityAction =
  | "UPDATED"
  | "DEPARTMENT_ASSIGNED"
  | "CREATED"
  | "DELETED"
  | "STATUS_CHANGED"
  | "MANAGER_ASSIGNED"
  | "MANAGER_REMOVED"
  | "EMPLOYEE_ADDED"
  | "EMPLOYEE_REMOVED"
  | "LEAVE_APPROVED"
  | "LEAVE_REJECTED"
  | "LEAVE_CANCELLED"
  | "LOGIN"
  | "LOGOUT";

export type ActivityEntity =
  | "DEPARTMENT"
  | "EMPLOYEE"
  | "LEAVE"
  | "DOCUMENT"
  | "ATTENDANCE"
  | "PAYSLIP"
  | "AUTH";

export interface TeamRecentActivity {
  id: string;
  action: ActivityAction;
  entity_type: ActivityEntity;
  entity_id: string;
  description: string;
  performed_by: string;
  department_id: string;
  created_at: string;
  user: ActivityUser;
}

export interface TeamRecentActivitiesResponse {
  success: boolean;
  message: string;
  data: TeamRecentActivity[];
}

export interface StatusBreakdown {
  count: number;
  percentage: number;
}

export interface TeamStatusBreakdown {
  total: number;
  active: StatusBreakdown;
  onLeave: StatusBreakdown;
  inactive: StatusBreakdown;
}

export interface TeamStatusBreakdownResponse {
  success: boolean;
  message: string;
  data: TeamStatusBreakdown;
}