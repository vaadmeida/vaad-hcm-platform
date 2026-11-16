import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DeleteLeaveTypePayload } from "../types/leave.types";
import { deleteLeaveTypes } from "../api/leave.api";

export const useDeleteLeaveType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: DeleteLeaveTypePayload) =>
      deleteLeaveTypes(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-leave-types"],
      });
    },
  });
};