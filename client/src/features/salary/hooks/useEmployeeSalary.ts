import { useQuery } from "@tanstack/react-query";
import { getEmployeeSalary } from "../api/salaries.api";

export const useEmployeeSalary = (employeeId: string | null) => {
  return useQuery({
    queryKey: ["employee-salary", employeeId],
    queryFn: async () => {
      if (!employeeId) {
        throw new Error("Employee ID is required.");
      }

      return getEmployeeSalary(employeeId);
    },
    enabled: Boolean(employeeId),
  });
};