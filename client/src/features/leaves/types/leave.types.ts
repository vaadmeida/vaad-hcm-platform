export interface LeaveStats {
  totalRequests: number;
  pendingRequests: number;
  approvedLeaves: number;
  rejectedLeaves: number;
  currentlyOnLeave: number;
}

export interface LeaveStatsResponse {
  success: boolean;
  message: string;
  data: LeaveStats;
}

export type LeaveStatus = "pending" | "approved" | "rejected";


export interface LeaveEmployee {
  id: string;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}

export interface LeaveTypeSummary {
  id: string;
  name: string;
}

export interface LeaveRequestSummary {
  id: string;
  start_date: string;
  end_date: string;
  total_days: number;
  status: LeaveStatus;
  created_at: string;
  employee: LeaveEmployee;
  leaveType: LeaveTypeSummary;
}

export interface RecentLeaveRequestsResponse {
  success: boolean;
  message: string;
  data: LeaveRequestSummary[];
}

export interface LeaveRequestEmployee {
  id: string;
  name: string;
  email: string;
}

export interface LeaveRequest {
  id: string;
  start_date: string;
  end_date: string;
  total_days: number;
  reason: string | null;
  status: LeaveStatus;
  approved_at: string | null;
  created_at: string;
  employee: LeaveRequestEmployee;
  leaveType: LeaveTypeSummary;
}

export interface LeaveRequestResponse {
  success: boolean;
  message: string;
  data: LeaveRequest[];
}

export interface LeaveRequestFilters {
  search?: string;
  status?: string;
  leave_type_id?: string;
}