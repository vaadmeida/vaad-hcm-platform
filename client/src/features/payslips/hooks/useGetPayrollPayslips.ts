import { skipToken, useQuery } from "@tanstack/react-query";

import { getPayrollPayslipsApi } from "../api/payslip.api";
import type { GetPayrollPayslipsParams } from "../types/payslip.types";

export const useGetPayrollPayslips = (
    payrollId: string | undefined,
    params: GetPayrollPayslipsParams = {}
) => {
    return useQuery({
        queryKey: ["payslips", payrollId, params],
        queryFn: payrollId
            ? () => getPayrollPayslipsApi(payrollId, params)
            : skipToken,
    });
};