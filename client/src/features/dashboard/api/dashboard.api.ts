import { api } from "@/lib";
import type { DashboardResponse, EmployeeChartResponse } from "../types/dashboard.type";

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

export const getEmployeeByDepartment = async (): Promise<EmployeeChartResponse> => {

  try {
    const response = await api.get("/api/dashboard/employees-by-department");

    return response.data;
  } catch (error) {
    console.error("EmployeesChartStats API Error:", error);
    throw error;
  }

}

export const getLeaveOverview = async () => {
  try {
    const response = await api.get("/api/dashboard/leave-overview");

    return response.data;
    
  } catch (error) {
    console.error("Leave Overview API Error:", error);
    throw error;
  }

}

