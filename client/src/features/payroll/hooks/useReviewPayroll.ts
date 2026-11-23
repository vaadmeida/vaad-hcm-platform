import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { reviewPayrollApi } from "../api/payroll.api";

export const useReviewPayroll = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payrollId: string) => reviewPayrollApi(payrollId),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["payrolls"],
            });

            toast.success("Payroll marked as reviewed.");
        },

        onError: (error) => {
            const message = isAxiosError<{ message?: string }>(error)
                ? error.response?.data?.message
                : undefined;

            toast.error(message || "Unable to review payroll. Please try again.");
        },
    });
};