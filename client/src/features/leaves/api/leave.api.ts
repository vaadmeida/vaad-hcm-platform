import { api } from "@/lib";
import type { EmployeeLeaveBalanceResponse, LeaveBalanceFilters, LeaveBalanceItem, LeaveBalanceResponse, LeaveRequestFilters, LeaveRequestResponse, LeaveStatsResponse, RecentLeaveRequestsResponse } from "../types/leave.types";

export const getLeaveStats = async (): Promise<LeaveStatsResponse> => {
  try {

    await new Promise((resolve) => setTimeout(resolve, 200));

    const response = await api.get<LeaveStatsResponse>("/api/leaves/stats");

    return response.data;

  } catch (error) {
    console.error("Leave Stats API Error:", error);
    throw error;
  }
};

export const getUpcomingLeavesRequests = async (): Promise<RecentLeaveRequestsResponse> => {
  try {
    const response = await api.get<RecentLeaveRequestsResponse>('/api/leaves/upcoming')
    return response.data;
  } catch (error) {
    console.error("Getting upcoming leaves API Error:", error);
    throw error;
  }
}
export const getRecentLeavesRequests = async (): Promise<RecentLeaveRequestsResponse> => {
  try {
    const response = await api.get<RecentLeaveRequestsResponse>('/api/leaves/recent')
    return response.data;
  } catch (error) {
    console.error("Getting upcoming leaves API Error:", error);
    throw error;
  }
}

export const getLeaveRequests = async (filters?: LeaveRequestFilters): Promise<LeaveRequestResponse> => {
  try {
    const response = await api.get<LeaveRequestResponse>(
      "/api/leaves/request", { params: filters });
    return response.data;
  } catch (error) {
    console.error("Getting leave requests API Error:", error);
    throw error;
  }
};



export const getAllLeaveBalance = async (filters?: LeaveBalanceFilters): Promise<LeaveBalanceItem[]> => {
  try {
    const response = await api.get<LeaveBalanceResponse>("/api/leaves/balance/all",
      {
        params: filters,
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Getting leave balances API Error:", error);
    throw error;
  }
};

export const getTeamLeaveBalance = async (
  filters?: LeaveBalanceFilters
): Promise<LeaveBalanceItem[]> => {
  try {
    const response = await api.get<LeaveBalanceResponse>(
      "/api/leaves/team-balance",
      {
        params: filters,
      }
    );

    return response.data.data;
  } catch (error) {
    console.error("Getting team leave balances API Error:", error);
    throw error;
  }
};

export const getEmployeeLeaveBalance = async (
  employeeId: string
): Promise<EmployeeLeaveBalanceResponse> => {
  try {
    const response = await api.get<EmployeeLeaveBalanceResponse>(
      `/api/leaves/balance/${employeeId}`
    );

    return response.data;
  } catch (error) {
    console.error("Getting employee leave balance API Error:", error);
    throw error;
  }
};