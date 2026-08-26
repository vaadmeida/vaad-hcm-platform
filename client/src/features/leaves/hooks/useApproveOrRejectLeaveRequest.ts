import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { approveOrRejectLeaveRequest } from "../api/leave.api";
import type { ApiError, ApproveOrRejectLeaveRequestPayload } from "../types/leave.types";


export const useApproveOrRejectLeaveRequest = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            id,
            payload,
        }: {
            id: string;
            payload: ApproveOrRejectLeaveRequestPayload;
        }) => approveOrRejectLeaveRequest(id, payload),

        onSuccess: (_, variables) => {
            if (variables.payload.action === "APPROVE") {
                toast.success("Leave request approved successfully");
            } else {
                toast.success("Leave request rejected successfully");
            }

            // Refresh all leave requests
            queryClient.invalidateQueries({
                queryKey: ["leave-requests"],
            });

            // Refresh leave balances
            queryClient.invalidateQueries({
                queryKey: ["leave-balances"],
            });

            // Refresh the currently opened leave request
            queryClient.invalidateQueries({
                queryKey: ["leave-request", variables.id],
            });
        },

        onError: (error: AxiosError<ApiError>) => {
            toast.error(
                error.response?.data?.message ||
                    "Failed to update leave request"
            );
        },
    });
};