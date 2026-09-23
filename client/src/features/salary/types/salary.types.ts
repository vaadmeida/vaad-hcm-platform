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