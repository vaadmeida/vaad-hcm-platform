import { api } from "@/lib";
import type {
    GeneratePayslipsResult,
    GetPayrollPayslipsParams,
    PayrollPayslipsResult,
    PayslipApiResponse,
    PayslipDownloadResult,
} from "../types/payslip.types";

export const generatePayrollPayslipsApi = async (
    payrollId: string
): Promise<GeneratePayslipsResult> => {
    const { data } = await api.post<PayslipApiResponse<GeneratePayslipsResult>>(
        `/api/payrolls/${encodeURIComponent(payrollId)}/payslips/generate`
    );

    return data.data;
};

export const getPayrollPayslipsApi = async (
    payrollId: string,
    params: GetPayrollPayslipsParams = {}
): Promise<PayrollPayslipsResult> => {
    const { data } = await api.get<PayslipApiResponse<PayrollPayslipsResult>>(
        `/api/payrolls/${encodeURIComponent(payrollId)}/payslips`,
        { params }
    );

    return data.data;
};

export const getPayslipDownloadApi = async (
    payslipId: string
): Promise<PayslipDownloadResult> => {
    const { data } = await api.get<PayslipApiResponse<PayslipDownloadResult>>(
        `/api/payslips/${encodeURIComponent(payslipId)}/download`
    );

    return data.data;
};