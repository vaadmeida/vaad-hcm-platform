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