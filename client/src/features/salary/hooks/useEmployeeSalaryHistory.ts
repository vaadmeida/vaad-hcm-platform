import { useQuery } from "@tanstack/react-query";
import { getEmployeeSalaryHistory } from "../api/salaries.api";

export const useEmployeeSalaryHistory = (
  employeeId: string | null
) => {
  return useQuery({
    queryKey: ["employee-salary-history", employeeId],
    queryFn: async () => {
      if (!employeeId) {
        throw new Error("Employee ID is required.");
      }

      return getEmployeeSalaryHistory(employeeId);
    },
    enabled: Boolean(employeeId),
  });
};