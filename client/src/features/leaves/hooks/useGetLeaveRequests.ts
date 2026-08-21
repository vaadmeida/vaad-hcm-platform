import { useQuery } from "@tanstack/react-query";

import { getLeaveRequests } from "../api/leave.api";

import type { LeaveRequestFilters } from "../types/leave.types";

export const useGetLeaveRequests = (filters: LeaveRequestFilters) => {
  return useQuery({
    queryKey: ["leave-requests", filters],
    queryFn: () => getLeaveRequests(filters),
  });
};