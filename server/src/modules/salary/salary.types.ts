export interface EmployeeSalaryFilters {
  page?: number;
  search?: string;
  department?: string;
  salaryStatus?: string;
}

export type AdditionalEarningFrequency =
  | "MONTHLY"
  | "ANNUAL"
  | "ONE_TIME";

export type CalculationBaseType =
  | "BASIC_SALARY"
  | "GROSS_SALARY"
  | "HOUSING_ALLOWANCE"
  | "TRANSPORT_ALLOWANCE"
  | "MEDICAL_ALLOWANCE"
  | "MEAL_ALLOWANCE"
  | "WARDROBE_ALLOWANCE"
  | "CUSTOM_AMOUNT";

export type SalaryReviewInput = {
    effectiveDate: Date;
    annualBaseSalary?: number;
    paye?: number;
    additionalEarnings?: {
        name: string;
        calculationType: "FIXED" | "PERCENTAGE";
        amount?: number;
        percentage?: number;
        calculationBaseType?: CalculationBaseType;
        calculationBase?: number;
        frequency: AdditionalEarningFrequency;
    }[];
};