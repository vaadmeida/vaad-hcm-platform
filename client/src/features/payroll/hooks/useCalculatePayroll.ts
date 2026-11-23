import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { calculatePayroll } from "../api/payroll.api";

export const useCalculatePayroll = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payrollId: string) => calculatePayroll(payrollId),

        onSuccess: async () => {
            await queryClient.invalidateQueries({
                queryKey: ["payrolls"],
            });

            toast.success("Payroll calculated successfully.");
        },

        onError: (error) => {
            const message = isAxiosError<{ message?: string }>(error)
                ? error.response?.data?.message
                : undefined;

            toast.error(message || "Unable to calculate payroll. Please try again.");
        },
    });
};