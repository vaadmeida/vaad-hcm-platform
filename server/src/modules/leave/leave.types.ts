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