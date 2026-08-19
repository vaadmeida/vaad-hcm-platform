import { useQuery } from "@tanstack/react-query";
import { getAllLeaveBalance } from "../api/leave.api";
import type { LeaveBalanceFilters } from "../types/leave.types";

export const useGetAllLeaveBalances = (
  filters?: LeaveBalanceFilters,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: ["leave-balances", "all", filters],
    queryFn: () => getAllLeaveBalance(filters),
    enabled: options?.enabled,
  });
};