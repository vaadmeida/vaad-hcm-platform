import { useQuery } from "@tanstack/react-query";
import { getLeaveRequests } from "../api/leave.api";

export const useGetLeaveRequests = () => {
  return useQuery({
    queryKey: ["get-leave-requests"],
    queryFn: getLeaveRequests,
  });
};