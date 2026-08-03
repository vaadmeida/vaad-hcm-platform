import { api } from "@/lib";
import type { Department } from "../types/departments.types";
import type { ApiResponse } from "@/features/employees/types/employee.types";

export const getDepartments = async (): Promise<Department[]> => {
  const response = await api.get<ApiResponse<Department[]>>(
    "/api/departments"
  );

  return response.data.data;
};