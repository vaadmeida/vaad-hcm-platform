import { useQuery } from "@tanstack/react-query";
import { getCurrentlyOnLeave } from "../api/leave.api";

export const useCurrentlyOnLeaves = () => {
  return useQuery({
    queryKey: ["currently-on-leave"],
    queryFn: getCurrentlyOnLeave,
  });
};