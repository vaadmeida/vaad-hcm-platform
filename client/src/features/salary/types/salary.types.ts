export type SalaryComponent = {
  id: string;
  salaryId: string;
  name: string;
  percentage: number;
  annualAmount: number;
  createdAt: string;
  updatedAt: string;
};

export type AdditionalEarningFrequency =
  | "MONTHLY"
  | "ANNUAL"
  | "ONE_TIME";

export type AdditionalEarning = {
  id: string;
  salaryId: string;
  name: string;
  amount: number;
  calculationType: "FIXED" | "PERCENTAGE";
  percentage: number | null;
  calculationBase: number | null;
  frequency: AdditionalEarningFrequency;
  createdAt: string;
  updatedAt: string;
};

export type EmployeeSalary = {
  id: string;
  employeeId: string;
  annualBaseSalary: number;
  effectiveDate: string;
  endDate: string | null;
  monthlyGross: number;
  paye: number;
  netPay: number;
  createdAt: string;
  updatedAt: string;
  components: SalaryComponent[];
  additionalEarnings: AdditionalEarning[];
};

export type EmployeeSalaryResponse = {
  success: boolean;
  message: string;
  data: EmployeeSalary;
};

export type CreateSalaryComponentDTO = Omit<
   SalaryComponent,
  "id" | "salaryId" | "createdAt" | "updatedAt"
>;

export type CreateAdditionalEarningDTO = Omit<
  AdditionalEarning,
  "id" | "salaryId" | "createdAt" | "updatedAt"
>;

export type CreateEmployeeSalaryDTO = {
  annualBaseSalary: number;
  effectiveDate: string;
  paye: number;
};

export type SalaryStatus = "ACTIVE" | "ENDED" | "NOT_CONFIGURED";

export interface EmployeeSalarySummary {
  id: string;
  annualBaseSalary: number;
  monthlyGross: number;
  paye: number;
  netPay: number;
  effectiveDate: string;
}

export interface SalaryDepartment {
  id: string;
  name: string;
}

export interface EmployeeWithSalary {
  employeeId: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  employeeName: string;
  employeeCode: string | null;
  avatarUrl: string | null;
  jobTitle: string | null;
  employmentStatus: string;
  departments: SalaryDepartment[];
  salary: EmployeeSalarySummary | null;
  salaryStatus: SalaryStatus;
}

export interface SalaryPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface GetEmployeesSalaryResponse {
  success: boolean;
  data: EmployeeWithSalary[];
  pagination: SalaryPagination;
}

export interface GetEmployeesSalaryParams {
  page?: number;
  search?: string;
  department?: string;
  salaryStatus?: SalaryStatus | "all";
}
