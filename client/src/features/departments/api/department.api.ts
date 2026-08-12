import { api } from "@/lib";
import type { AssignDepartmentManagerDto, Department, DepartmentTeam, TeamRecentActivitiesResponse, TeamRecentActivity, TeamStatusBreakdown, TeamStatusBreakdownResponse, UpdateDepartmentDto } from "../types/departments.types";
import type { ApiResponse } from "@/features/employees/types/employee.types";

export const getDepartments = async (): Promise<Department[]> => {

  try {
    const response = await api.get<ApiResponse<Department[]>>("/api/departments");
    return response.data.data;
  } catch (error) {
    console.error("Get Departments API Error:", error);
    throw error;
  }

};

export const getDepartmentById = async (departmentId: string): Promise<Department> => {
  try {
    const response = await api.get<ApiResponse<Department>>(
      `/api/departments/${departmentId}`
    );

    return response.data.data;

  } catch (error) {
    console.error("Get Department By ID API Error:", error);
    throw error;
  }
};
export const getTeamMembers = async (departmentId: string): Promise<DepartmentTeam> => {

  try {
    const response = await api.get<ApiResponse<DepartmentTeam>>(
      `/api/departments/${departmentId}/employees`
    );

    return response.data.data;
  } catch (error) {
    console.error("Get Department Members API Error:", error);
    throw error;
  }
};
export const getTeamRecentActivities = async (departmentId: string): Promise<TeamRecentActivity[]> => {
 
  try {
    const response = await api.get<TeamRecentActivitiesResponse>(
      `/api/departments/${departmentId}/activities`
    );

    return response.data.data;

  } catch (error) {

    console.error("Get Team Recent Activities API Error:", error);
    throw error;

  }
};

export const getTeamStatusBreakdown = async (
  departmentId: string
): Promise<TeamStatusBreakdown> => {
  try {
    const response = await api.get<TeamStatusBreakdownResponse>(
      `/api/departments/${departmentId}/stats`
    );

    return response.data.data;
  } catch (error) {
    console.error("Get Team Status Breakdown API Error:", error);
    throw error;
  }
};

export const createDepartment = async (payload: Partial<Department>): Promise<Department> => {

  try {
    const response = await api.post<ApiResponse<Department>>("/api/departments", payload);
    return response.data.data;
  } catch (error) {
    console.error("Create Department API Error:", error);
    throw error;
  }

}

export const updateDepartment = async (departmentId: string, payload: Partial<UpdateDepartmentDto>): Promise<Department> => {

  try {
    const response = await api.patch<ApiResponse<Department>>(`/api/departments/${departmentId}`, payload);
    return response.data.data;
  } catch (error) {
    console.error("Update Department API Error:", error);
    throw error;
  }

}
export const assignDepartmentManager = async (departmentId: string, payload: AssignDepartmentManagerDto): Promise<Department> => {

  try {
    const response = await api.patch<ApiResponse<Department>>(`/api/departments/${departmentId}/manager`, payload);
    return response.data.data;
  } catch (error) {
    console.error("Assign Department Manager API Error:", error);
    throw error;
  }

}
export const removeDepartmentManager = async (departmentId: string): Promise<Department> => {

  try {
    const response = await api.delete<ApiResponse<Department>>(
      `/api/departments/${departmentId}/manager`
    );

    return response.data.data;
  } catch (error) {
    console.error("Remove Department Manager API Error:", error);
    throw error;
  }
};