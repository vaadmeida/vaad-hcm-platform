import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { approvePayrollApi } from "../api/payroll.api";

export const useApprovePayroll = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: approvePayrollApi,

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["payrolls"],
            });

            toast.success("Payroll approved.");
        },

        onError: (error) => {
            const message = isAxiosError<{ message?: string }>(error)
                ? error.response?.data?.message
                : undefined;

            toast.error(message || "Unable to approve payroll. Please try again.");
        },
    });
};