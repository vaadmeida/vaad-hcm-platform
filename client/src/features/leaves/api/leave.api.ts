import { api } from "@/lib";
import type { LeaveStatsResponse } from "../types/leave.types";

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