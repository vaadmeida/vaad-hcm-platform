
export type PayrollStatus =
  | "DRAFT"
  | "CALCULATED"
  | "REVIEWED"
  | "APPROVED"
  | "PROCESSED";

export interface GetPayrollsParams {
  page?: number;
  limit?: number;
  year?: number;
  month?: number;
  status?: PayrollStatus;
}

export interface LatestPayroll {
  month: number;
  year: number;
  status: PayrollStatus;
  netPay: string | number;
}

export interface PayrollStats {
  totalPayrolls: number;
  totalProcessed: number;
  totalPending: number;
  latestPayroll: LatestPayroll | null;
}

export interface MonthlyPayroll {
  id: string;
  month: number;
  year: number;
  status: PayrollStatus;
  totalEmployees: number;
  totalGross: string | number;
  totalEarnings: string | number;
  totalPaye: string | number;
  totalDeductions: string | number;
  totalNetPay: string | number;
  preparedAt: string | null;
  createdAt: string;
}

export interface PayrollPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface GetPayrollsResponse {
    years: number[];
    payrolls: MonthlyPayroll[];
    pagination: PayrollPagination;
}

export interface PayrollApiResponse {
  success: boolean;
  message: string;
  data: GetPayrollsResponse;
}

export interface PreparePayrollInput {
    month: number;
    year: number;
}

export interface PreparedPayroll {
    id: string;
    month: number;
    year: number;
    periodStart: string;
    periodEnd: string;
    status: PayrollStatus;
    preparedBy: string;
    preparedAt: string;
    createdAt: string;
    updatedAt: string;
}

export interface PreparePayrollResponse {
    success: boolean;
    message: string;
    data: PreparedPayroll;
}


export type PayrollAmount = string | number;

export interface PayrollSalaryComponent {
    id: string;
    payrollEmployeeId: string;
    name: string;
    percentage: PayrollAmount;
    annualAmount: PayrollAmount;
    monthlyAmount: PayrollAmount;
}

export interface PayrollEmployeeEarning {
    id: string;
    payrollEmployeeId: string;
    name: string;
    amount: PayrollAmount;
    calculationType: "FIXED" | "PERCENTAGE";
    percentage: PayrollAmount | null;
    calculationBase: PayrollAmount | null;
    calculationBaseType: "BASIC_SALARY" | null;
    frequency: "MONTHLY" | "ANNUAL";
}

export interface PayrollEmployeeRecord {
    id: string;
    payrollId: string;
    employeeId: string;
    employeeName: string;
    employeeNumber: string | null;
    employeeEmail: string;
    jobTitle: string;
    departmentNames: string[];

    annualBaseSalary: PayrollAmount;
    monthlyGross: PayrollAmount;
    additionalEarnings: PayrollAmount;
    grossPay: PayrollAmount;
    paye: PayrollAmount;
    otherDeductions: PayrollAmount;
    netPay: PayrollAmount;

    createdAt: string;
    updatedAt: string;

    components: PayrollSalaryComponent[];
    earnings: PayrollEmployeeEarning[];
    payslip: unknown;

    employee: {
        avatar_url: string | null;
        employee_code: string | null;
    } | null;
}

export interface PayrollEmployeesPagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface AnnualEarningPayment {
    id: string;
    employeeId: string;
    type: "THIRTEENTH_MONTH";
    year: number;
    amount: PayrollAmount;
    status: "PENDING";
    payrollId: string;
    paidAt: string | null;
    createdAt: string;
    updatedAt: string;
}

export interface PayrollDetails {
    id: string;
    month: number;
    year: number;
    periodStart: string;
    periodEnd: string;
    status: PayrollStatus;
    totalEmployees: number;
    totalGross: PayrollAmount;
    totalEarnings: PayrollAmount;
    totalPaye: PayrollAmount;
    totalDeductions: PayrollAmount;
    totalNetPay: PayrollAmount;
    reviewedBy: string | null;
    reviewedAt: string | null;
    preparedBy: string;
    approvedBy: string | null;
    processedBy: string | null;
    preparedAt: string;
    approvedAt: string | null;
    processedAt: string | null;
    createdAt: string;
    updatedAt: string;
    employees: PayrollEmployeeRecord[];
    annualEarningPayments: AnnualEarningPayment[];
    departments: string[];
    pagination: PayrollEmployeesPagination;
    skippedEmployees: SkippedPayrollEmployee[];
}
export interface GetPayrollByIdResponse {
    success: boolean;
    message: string;
    data: {
        payroll: PayrollDetails;
    };
}

export interface GetPayrollByIdParams {
    search?: string;
    department?: string;
    page?: number;
    limit?: number;
}

export type SkippedPayrollEmployee = {
  employeeId: string;
  employeeName: string;
  reason: "SALARY_NOT_CONFIGURED" | "NO_SALARY_FOR_PAYROLL_PERIOD";
};

export type CalculatedPayrollEmployee = {
  id: string;
  employeeId: string;
  employeeName: string;
  monthlyGross: string;
  additionalEarnings: string;
  grossPay: string;
  paye: string;
  otherDeductions: string;
  netPay: string;
};
export type CalculatedMonthlyPayroll = {
  id: string;
  month: number;
  year: number;
  periodStart: string;
  periodEnd: string;
  status: "CALCULATED";
  totalEmployees: number;
  totalGross: string;
  totalEarnings: string;
  totalPaye: string;
  totalDeductions: string;
  totalNetPay: string;
  employees: CalculatedPayrollEmployee[];
};

export type CalculatePayrollResult = {
  payroll: CalculatedMonthlyPayroll;
  skippedEmployees: SkippedPayrollEmployee[];
};

export type CalculatePayrollResponse = {
  success: true;
  message: string;
  data: CalculatePayrollResult;
};


export type ReviewedPayroll = {
    id: string;
    status: "REVIEWED";
    reviewedBy: string;
    reviewedAt: string;
};

export type ReviewPayrollResponse = {
    success: true;
    message: string;
    data: ReviewedPayroll;
};

export type OnViewPayslips = (year: number, month: number) => void;

export type ProcessedPayrollSummary = {
    id: string;
    month: number;
    year: number;
    totalEmployees: number;
    totalGross: PayrollAmount;
    totalPaye: PayrollAmount;
    totalNetPay: PayrollAmount;
};

export type PayrollOverviewData = {
    latestPayroll: ProcessedPayrollSummary | null;
    inProgressPayroll: {
        id: string;
        month: number;
        year: number;
        status: Extract<
            PayrollStatus,
            "DRAFT" | "CALCULATED" | "REVIEWED" | "APPROVED"
        >;
    } | null;
    recentProcessedPayrolls: ProcessedPayrollSummary[];
};