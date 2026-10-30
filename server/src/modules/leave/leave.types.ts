import { User } from "../employees/employee.service.ts";

export type CreateLeaveTypes = {
    name: string;
    user: {
        id: string;
        role: "admin" | "hr" | "manager" | "employee";
    };
    default_days_per_year?: number | null;
    requires_document?: boolean
    is_paid?: boolean;
    carries_over?: boolean;
    max_carryover_days?: number | null;
};

export type SubmitLeaveRequestType = {
    leave_type_id: string
    start_date: Date
    end_date: Date
    reason?: string
    document_url?: string
}

export interface GetLeaveRequestsInput {
    user: User;
    status?: string;
    employee_id?: string;
    search?: string;
    leave_type_id?: string;
    page?: number;
    limit?: number;
}

export interface LeaveBalanceFilters {
  search?: string;
  departmentId?: string;
  leaveTypeId?: string;
  page?: number;
  limit?: number;
}

export interface AdminLeaveStats {
  totalRequests: number;
  pendingRequests: number;
  approvedLeaves: number;
  currentlyOnLeave: number;
}

export interface ManagerLeaveStats {
  totalRequests: number;
  pendingRequests: number;
  approvedRequests: number;
  currentlyOnLeave: number;
}

export interface EmployeeLeaveStats {
  totalRequests: number;
  pendingRequests: number;
  approvedLeaves: number;
  rejectedLeaves: number;
  currentlyOnLeave: number;
}

export type LeaveStats =
  | AdminLeaveStats
  | ManagerLeaveStats
  | EmployeeLeaveStats;