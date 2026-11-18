import { useMutation, useQueryClient } from "@tanstack/react-query";
import { preparePayrollApi } from "../api/payroll.api";
import type { PreparePayrollInput } from "../types/payroll.types";

export const usePreparePayroll = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: PreparePayrollInput) =>
            preparePayrollApi(payload),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["payrolls"],
            });
        },
    });
};