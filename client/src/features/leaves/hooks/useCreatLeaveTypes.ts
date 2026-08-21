import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateLeaveTypePayload } from "../types/leave.types";
import { createLeaveType } from "../api/leave.api";

export const useCreateLeaveType = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLeaveTypePayload) => createLeaveType(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["get-leave-types"],
      });
    },
  });
};