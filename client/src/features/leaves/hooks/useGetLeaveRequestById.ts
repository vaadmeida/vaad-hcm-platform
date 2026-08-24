import { useQuery } from "@tanstack/react-query";
import { getLeaveRequestById } from "../api/leave.api";

export const useGetLeaveRequestById = (id: string) => {
  return useQuery({
    queryKey: ["leave-request", id],
    queryFn: () => getLeaveRequestById(id),
    enabled: !!id,
  });
};