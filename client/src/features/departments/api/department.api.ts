import { api } from "@/lib";
import type { Department } from "../types/departments.types";
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

export const createDepartment = async (payload: Partial<Department>): Promise<Department> => {

  try {
    const response = await api.post<ApiResponse<Department>>("/api/departments", payload);
    return response.data.data;
  } catch (error) {
    console.error("Create Department API Error:", error);
    throw error;
  }

}