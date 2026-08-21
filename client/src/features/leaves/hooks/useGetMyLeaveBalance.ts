import { useQuery } from "@tanstack/react-query";
import { getMyLeaveBalance } from "../api/leave.api";

export const useGetMyLeaveBalance = () => {
  return useQuery({
    queryKey: ["my-leave-balance"],
    queryFn: getMyLeaveBalance,
    staleTime: 5 * 60 * 1000,
  });
};