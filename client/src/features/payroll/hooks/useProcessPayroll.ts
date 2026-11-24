import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";
import { processPayrollApi } from "../api/payroll.api";

export const useProcessPayroll = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: processPayrollApi,

        onSuccess: async () => {
            await queryClient.invalidateQueries({ queryKey: ["payrolls"] });
            toast.success("Payroll marked as processed.");
        },

        onError: (error) => {
            const message = isAxiosError<{ message?: string }>(error)
                ? error.response?.data?.message
                : undefined;

            toast.error(message || "Unable to process payroll. Please try again.");
        },
    });
};