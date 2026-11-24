import { api } from "@/lib";
import type { CalculatePayrollResponse, CalculatePayrollResult, GetPayrollByIdParams, GetPayrollByIdResponse, GetPayrollsParams, PayrollApiResponse, ReviewedPayroll, ReviewPayrollResponse } from "../types/payroll.types";

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

    return response.data;
};


export async function calculatePayroll(
  payrollId: string
): Promise<CalculatePayrollResult> {
  const { data } = await api.post<CalculatePayrollResponse>(
    `api/payrolls/${encodeURIComponent(payrollId)}/calculate`
  );

  return data.data;
}


export const reviewPayrollApi = async (
    payrollId: string
): Promise<ReviewedPayroll> => {
    const { data: response } = await api.patch<ReviewPayrollResponse>(
        `api/payrolls/${encodeURIComponent(payrollId)}/review`
    );

    return response.data;
};



export const approvePayrollApi = async (payrollId: string): Promise<void> => {
    await api.patch(`/api/payrolls/${encodeURIComponent(payrollId)}/approve`);
};

export const processPayrollApi = async (payrollId: string): Promise<void> => {
    await api.post(`/api/payrolls/${encodeURIComponent(payrollId)}/process`);
};

export const deletePayrollApi = async (payrollId: string): Promise<void> => {
    await api.delete(`/api/payrolls/${encodeURIComponent(payrollId)}`);
};