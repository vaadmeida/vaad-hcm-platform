import { api } from "@/lib";
import type { LeaveRequestResponse, LeaveStatsResponse, RecentLeaveRequestsResponse } from "../types/leave.types";

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
export const getLeaveRequests = async (): Promise<LeaveRequestResponse> => {
  try {
    const response = await api.get<LeaveRequestResponse>('/api/leaves/request')
    return response.data;
  } catch (error) {
    console.error("Getting upcoming leaves API Error:", error);
    throw error;
  }
}