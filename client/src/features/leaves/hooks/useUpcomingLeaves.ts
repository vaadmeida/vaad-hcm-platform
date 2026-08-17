import { useQuery } from "@tanstack/react-query";
import { getUpcomingLeavesRequests } from "../api/leave.api";

export const useUpcomingLeaves = () => {
  return useQuery({
    queryKey: ["upcoming-leave-requests"],
    queryFn: getUpcomingLeavesRequests,
  });
};