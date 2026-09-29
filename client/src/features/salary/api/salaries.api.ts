
import { api } from "@/lib/axios.api.ts";
import type { CreateEmployeeSalaryDTO, EmployeeSalaryResponse } from "../types/salary.types.ts";

export const getEmployeeSalary = async (
  employeeId: string
): Promise<EmployeeSalaryResponse> => {
  const response = await api.get<EmployeeSalaryResponse>(`/api/salaries/employees/${employeeId}`);

  return response.data;
};




export const createEmployeeSalary = async (
  employeeId: string,
  payload: CreateEmployeeSalaryDTO
): Promise<EmployeeSalaryResponse> => {
  const response = await api.post<EmployeeSalaryResponse>(
    `/api/salaries/employees/${employeeId}`,payload);

  return response.data;
};


export const updateEmployeeSalary = async (
  employeeId: string,
  payload: Partial<CreateEmployeeSalaryDTO>
): Promise<EmployeeSalaryResponse> => {
  const response = await api.patch<EmployeeSalaryResponse>(
    `/api/salaries/employees/${employeeId}`,
    payload
  );

  return response.data;
};


export const getMySalary = async (): Promise<EmployeeSalaryResponse> => {
  const response = await api.get<EmployeeSalaryResponse>(
    "/api/salaries/me"
  );

  return response.data;
};