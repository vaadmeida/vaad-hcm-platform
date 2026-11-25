export type PayslipApiResponse<T> = {
    success: true;
    message: string;
    data: T;
};

export type GeneratePayslipsResult = {
    payrollId: string;
    totalEmployees: number;
    readyCount: number;
};

export type GetPayrollPayslipsParams = {
    page?: number;
    limit?: number;
    search?: string;
};

export type PayrollPayslip = {
    payslipId: string;
    fileName: string | null;
    generatedAt: string | null;
    employeeName: string;
    employeeNumber: string | null;
    departmentNames: string[];
    netPay: string;
};

export type PayrollPayslipsResult = {
    payroll: {
        id: string;
        month: number;
        year: number;
    };
    payslips: PayrollPayslip[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
};

export type PayslipDownloadResult = {
    payslipId: string;
    downloadUrl: string;
    expiresIn: number;
};