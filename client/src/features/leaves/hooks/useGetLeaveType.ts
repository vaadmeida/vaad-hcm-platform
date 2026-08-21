import { useQuery } from "@tanstack/react-query";

import { getLeaveTypes } from "../api/leave.api";

export const useGetLeaveTypes = () => {
    
    return useQuery({
    queryKey: ["get-leave-types"],
    queryFn: getLeaveTypes,
  });
};