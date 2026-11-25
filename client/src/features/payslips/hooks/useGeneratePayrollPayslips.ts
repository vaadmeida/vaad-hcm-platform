import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { toast } from "sonner";

import { generatePayrollPayslipsApi } from "../api/payslip.api";

export const useGeneratePayrollPayslips = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: generatePayrollPayslipsApi,

        onSuccess: async ({ payrollId, readyCount, totalEmployees }) => {
            await Promise.all([
                queryClient.invalidateQueries({
                    queryKey: ["payrolls", payrollId],
                }),
                queryClient.invalidateQueries({
                    queryKey: ["payslips", payrollId],
                }),
            ]);

            if (totalEmployees === 0) {
                toast.info("This payroll has no employees to generate payslips for.");
                return;
            }

            toast.success(`${readyCount} of ${totalEmployees} payslips ready.`);
        },

        onError: (error) => {
            const message = isAxiosError<{ message?: string }>(error)
                ? error.response?.data?.message
                : undefined;

            toast.error(message || "Unable to generate payslips. Please try again.");
        },
    });
};