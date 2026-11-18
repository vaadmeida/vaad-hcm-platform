import { api } from "@/lib";
import type { GetPayrollByIdParams, GetPayrollByIdResponse, GetPayrollsParams, PayrollApiResponse } from "../types/payroll.types";

export const getPayrollsApi = async (
  params?: GetPayrollsParams
): Promise<PayrollApiResponse> => {
  const { data } = await api.get<PayrollApiResponse>("/api/payrolls", {
    params,
  });

  return data;
};

import type {
    PreparePayrollInput,
    PreparePayrollResponse,
} from "../types/payroll.types";

export const preparePayrollApi = async (
    payload: PreparePayrollInput
): Promise<PreparePayrollResponse> => {
    const { data } = await api.post<PreparePayrollResponse>(
        "/api/payrolls/prepare",
        payload
    );

    return data;
};


export const getPayrollById = async (
    payrollId: string,
    params: GetPayrollByIdParams = {}
): Promise<GetPayrollByIdResponse> => {
    const response = await api.get<GetPayrollByIdResponse>(
        `/api/payrolls/${payrollId}`,
        { params }
    );

    console.log("Filtered employees:", response.data.data.payroll.employees);
    console.log("Pagination:", response.data.data.payroll.pagination);

    return response.data;
};