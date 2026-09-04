import { useMutation, useQueryClient } from "@tanstack/react-query";
import { submitLeaveRequest } from "../api/leave.api";

export const useSubmitLeaveRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitLeaveRequest,

    onSuccess: () => {
      // Refresh leave requests table
      queryClient.invalidateQueries({
        queryKey: ["leave-requests"],
      });

      // Refresh leave balances
      queryClient.invalidateQueries({
        queryKey: ["leave-balances"],
      });

      // Refresh employee's My Leave balance
      queryClient.invalidateQueries({
        queryKey: ["my-leave-balance"],
      });

      // Refresh upcoming leave requests
      queryClient.invalidateQueries({
        queryKey: ["upcoming-leave-requests"],
      });

    
      // Refresh recent leave requests
      queryClient.invalidateQueries({
        queryKey: ["recent-leave-requests"],
      });

    },
  });
};