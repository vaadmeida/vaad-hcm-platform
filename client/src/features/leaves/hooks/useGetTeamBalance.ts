import { useQuery } from "@tanstack/react-query";
import { getTeamLeaveBalance } from "../api/leave.api";
import type { LeaveBalanceFilters } from "../types/leave.types";

export const useGetTeamLeaveBalances = (
  filters?: LeaveBalanceFilters,
  options?:{
      enabled?: boolean;
  }
) => {
  return useQuery({
    queryKey: ["leave-balances", "team", filters],
    queryFn: () => getTeamLeaveBalance(filters),
    enabled: options?.enabled,
  });
};