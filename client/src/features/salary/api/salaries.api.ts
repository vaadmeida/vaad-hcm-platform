
import { api } from "@/lib/axios.api.ts";
import type { EmployeeSalaryResponse } from "../types/salary.types.ts";

export const getEmployeeSalary = async (
  employeeId: string
): Promise<EmployeeSalaryResponse> => {
  const response = await api.get<EmployeeSalaryResponse>(`/api/salaries/employees/${employeeId}`);

  return response.data;
};