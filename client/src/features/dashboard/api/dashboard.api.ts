import { api } from "@/lib";
import type { DashboardResponse } from "../types/dashboard.type";

export const getDashboardStats = async (): Promise<DashboardResponse> => {
  try {

    await new Promise((resolve) => setTimeout(resolve, 200));

    const response = await api.get("/api/dashboard/stats");

    return response.data;
    
  } catch (error) {
    console.error("Dashboard API Error:", error);
    throw error;
  }
};