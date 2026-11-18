import { useQuery } from "@tanstack/react-query";
import { getPayrollsApi } from "../api/payroll.api";
import type { GetPayrollsParams } from "../types/payroll.types";

export const useGetPayrolls = (params: GetPayrollsParams) => {
  return useQuery({
    queryKey: ["payrolls", params],
    queryFn: () => getPayrollsApi(params),
    select: (response) => response.data,
  });
};
