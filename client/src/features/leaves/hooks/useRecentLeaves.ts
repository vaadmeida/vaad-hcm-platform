import { useQuery } from "@tanstack/react-query";
import { getRecentLeavesRequests } from "../api/leave.api";

export const useRecentLeaveRequests = () => {
  return useQuery({
    queryKey: ["recent-leave-requests"],
    queryFn: getRecentLeavesRequests,
  });
};