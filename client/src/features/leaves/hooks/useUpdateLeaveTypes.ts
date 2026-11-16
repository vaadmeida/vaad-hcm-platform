import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateLeaveTypePayload } from "../types/leave.types";
import { updateLeaveTypes } from "../api/leave.api";


export const useUpdateLeaveTypes = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateLeaveTypePayload) =>
      updateLeaveTypes(payload),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-leave-types"],
      });
    },
  });
};