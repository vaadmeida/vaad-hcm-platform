import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { GetPayrollByIdParams } from "../types/payroll.types";
import { getPayrollById } from "../api/payroll.api";

export const useGetPayrollById = (
    payrollId: string,
    params: GetPayrollByIdParams = {}
) => {
    return useQuery({
        queryKey: ["payrolls", payrollId, "details", params],
        queryFn: () => getPayrollById(payrollId, params),
        enabled: Boolean(payrollId),
        placeholderData: keepPreviousData,
    });
};