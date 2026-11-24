import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { deletePayrollApi } from "../api/payroll.api";

export const useDeletePayroll = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deletePayrollApi,

        onSuccess: async (_, payrollId) => {
            queryClient.removeQueries({
                queryKey: ["payrolls", payrollId],
                type: "inactive",
            });

            await queryClient.invalidateQueries({
                queryKey: ["payrolls", "list"],
            });

            toast.success("Payroll deleted.");
        },

        onError: (error) => {
            const message = isAxiosError<{ message?: string }>(error)
                ? error.response?.data?.message
                : undefined;

            toast.error(message || "Unable to delete payroll. Please try again.");
        },
    });
};