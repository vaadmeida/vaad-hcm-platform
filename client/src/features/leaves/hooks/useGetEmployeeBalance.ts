import { useQuery } from "@tanstack/react-query";
import { getEmployeeLeaveBalance } from "../api/leave.api";

export const useGetEmployeeLeaveBalance = (
  employeeId: string,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: ["leave-balance", "employee", employeeId],
    queryFn: () => getEmployeeLeaveBalance(employeeId),
    enabled: options?.enabled ?? !!employeeId,
  });
};