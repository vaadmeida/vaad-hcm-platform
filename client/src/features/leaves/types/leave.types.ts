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
  first_name: string;
  last_name: string;
  email: string;
  avatar_url: string | null;
  department: {
    id: string;
    name: string;
  } | null;
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
export interface LeaveBalanceFilters {
  search?: string;
  departmentId?: string;
  leaveTypeId?: string;
  page?: number;
}
export interface LeaveBalanceEmployee {
  id: string;
  first_name: string;
  last_name: string;
  department: {
    name: string;
  } | null;
  avatar_url: string | null;
}

export interface LeaveBalanceItem {
  employee: LeaveBalanceEmployee;
  total_used: number;
  active_types_used: number;
  leave_types_used: string[];
}

export interface LeaveBalanceResponse {
  success: boolean;
  data: LeaveBalanceItem[];
}

export interface EmployeeLeaveBalance {
  id: string;
  year: number;
  leaveType: {
    id: string;
    name: string;
  };
  allocated: number;
  used: number;
  pending: number;
  remaining: number;
  usage_percentage: number;
}

export interface EmployeeLeaveBalanceResponse {
  success: boolean;
  data: {
    employee: LeaveBalanceEmployee;
    balances: EmployeeLeaveBalance[];
  };
}

export interface LeaveType {
  id: string;
  name: string;
  default_days_per_year: number | null;
  requires_document: boolean;
  is_paid: boolean;
  carries_over: boolean;
  max_carryover_days: number;
  created_at: string;
}

export interface LeaveTypesResponse {
  success: boolean;
  count: number;
  data: LeaveType[];
}

export interface CreateLeaveTypePayload {
  name: string;
  default_days_per_year: number | null;
  requires_document: boolean;
  is_paid: boolean;
  carries_over: boolean;
  max_carryover_days: number;
}


export interface CreateLeaveTypeResponse {
  success: boolean;
  message: string;
  data: LeaveType;
}
export interface LeaveBalanceLeaveType {
  id: string;
  name: string;
}

export interface LeaveBalance {
  id: string;
  year: number;
  leaveType: LeaveBalanceLeaveType;
  allocated: number;
  used: number;
  pending: number;
  remaining: number;
  usage_percentage: number;
}

export interface SubmitLeaveRequestType {
  leave_type_id: string;
  start_date: string;
  end_date: string;
  reason?: string;
  document_url?: string;
}

export interface SubmitLeaveRequestResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    employee_id: string;
    leave_type_id: string;
    start_date: string;
    end_date: string;
    total_days: number;
    reason?: string | null;
    document_url?: string | null;
    status: LeaveStatus;
    created_at: string;
    employee?: {
      id: string;
      first_name: string;
      last_name: string;
      email: string;
      avatar_url?: string | null;
    };
    leaveType?: {
      id: string;
      name: string;
    };
  };
}

export interface LeaveApiError {
  success: boolean;
  status: number;
  code: string;
  message: string;
  detail: string | null;
}

export interface LeaveRequestLeaveType {
  id: string;
  name: string;
  default_days_per_year: number | null;
  requires_document: boolean;
  is_paid: boolean;
  carries_over: boolean;
  max_carryover_days: number;
  created_at: string;
}

export interface LeaveRequestApprover {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
}

export interface LeaveRequestDetails {
  id: string;
  employee_id: string;
  leave_type_id: string;
  start_date: string;
  end_date: string;
  total_days: string;
  reason: string | null;
  status: string;
  approved_by: string | null;
  approved_at: string | null;
  rejection_reason: string | null;
  created_at: string;
  updated_at: string;

  approver: LeaveRequestApprover | null;
  employee: LeaveRequestEmployee;
  leaveType: LeaveRequestLeaveType;
}

export interface LeaveRequestDetailsResponse {
  success: boolean;
  message: string;
  data: LeaveRequestDetails;
}