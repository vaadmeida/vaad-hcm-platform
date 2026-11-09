import { useQuery } from "@tanstack/react-query";
import type { GetEmployeesSalaryParams } from "../types/salary.types";
import { getEmployeesWithSalary } from "../api/salaries.api";

export const useGetEmployeesWithSalary = (
  params: GetEmployeesSalaryParams
) => {
  return useQuery({
    queryKey: ["employees-salary", params],
    queryFn: () => getEmployeesWithSalary(params),
  });
};