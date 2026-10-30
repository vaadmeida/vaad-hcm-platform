import { useQuery } from "@tanstack/react-query";
import { getAllLeaveBalance } from "../api/leave.api";
import type {
  LeaveBalanceFilters,
  LeaveBalanceResponse,
} from "../types/leave.types";

export const useGetAllLeaveBalances = (
  filters?: LeaveBalanceFilters,
  options?: {
    enabled?: boolean;
  }
) => {
  return useQuery<LeaveBalanceResponse>({
    queryKey: ["leave-balances", "all", filters],
    queryFn: () => getAllLeaveBalance(filters),
    enabled: options?.enabled,
  });
};