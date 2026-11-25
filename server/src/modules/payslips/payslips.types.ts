export type GeneratePayrollPayslipsResult = {
    payrollId: string;
    totalEmployees: number;
    readyCount: number;
};

export type PayslipLine = {
    label: string;
    amount: string;
};

export type PayslipPdfInput = {
    month: number;
    year: number;
    employeeName: string;
    employeeNumber: string | null;
    departmentNames: string[];
    components: PayslipLine[];
    earnings: PayslipLine[];
    monthlyGross: string;
    grossPay: string;
    paye: string;
    otherDeductions: string;
    netPay: string;
};
