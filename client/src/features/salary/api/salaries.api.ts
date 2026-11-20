import { api } from "@/lib/axios.api.ts";
import type { CreateEmployeeSalaryDTO, DeleteSalaryHistoryParams, DeleteSalaryHistoryResponse, EmployeeSalaryHistory, EmployeeSalaryResponse, GetEmployeesSalaryParams, GetEmployeesSalaryResponse, ReviewEmployeeSalaryDTO } from "../types/salary.types.ts";

export const getEmployeesWithSalary = async (
  params: GetEmployeesSalaryParams
): Promise<GetEmployeesSalaryResponse> => {
  const response = await api.get("/api/salaries/employees", {
    params,
  });

  return response.data;
};

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

export const reviewEmployeeSalary = async (
  employeeId: string,
  payload: ReviewEmployeeSalaryDTO
): Promise<EmployeeSalaryResponse> => {
  const response = await api.post<EmployeeSalaryResponse>(
    `/api/salaries/employees/${employeeId}/review`,
    payload
  );

  return response.data;
};

export const getEmployeeSalaryHistory = async (
  employeeId: string
): Promise<EmployeeSalaryHistory[]> => {
  const response = await api.get(
    `/api/salaries/employees/${employeeId}/history`
  );

  return response.data.data;
};
  
export const getMySalary = async (): Promise<EmployeeSalaryResponse> => {
  const response = await api.get<EmployeeSalaryResponse>(
    "/api/salaries/me"
  );

  return response.data;
};


export const deleteSalaryHistory = async ({
  employeeId,
  salaryId,
}: DeleteSalaryHistoryParams): Promise<DeleteSalaryHistoryResponse> => {
  const { data } = await api.delete<DeleteSalaryHistoryResponse>(
    `/api/salaries/employees/${employeeId}/salary-history/${salaryId}`
  );

  return data;
};