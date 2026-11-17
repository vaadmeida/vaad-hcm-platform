import { CalculationBaseType, MonthlyPayrollStatus, Prisma } from "@prisma/client";

export interface PreparePayrollInput {
    month: number;
    year: number;
}

export interface EmployeePayrollSnapshot {
    employeeId: string;
    employeeName: string;
    employeeNumber: string | null;
    employeeEmail: string;
    jobTitle: string | null;
    departmentNames: string[];
    annualBaseSalary: Prisma.Decimal;
    monthlyGross: Prisma.Decimal;
    additionalEarnings: Prisma.Decimal;
    grossPay: Prisma.Decimal;
    paye: Prisma.Decimal;
    otherDeductions: Prisma.Decimal;
    netPay: Prisma.Decimal;

    components: {
        name: string;
        percentage: Prisma.Decimal;
        annualAmount: Prisma.Decimal;
        monthlyAmount: Prisma.Decimal;
    }[];

    earnings: {
        name: string;
        amount: Prisma.Decimal;
        calculationType: "FIXED" | "PERCENTAGE";
        percentage: Prisma.Decimal | null;
        calculationBase: Prisma.Decimal | null;
        calculationBaseType: CalculationBaseType | null;
        frequency: "MONTHLY" | "ANNUAL";
    }[];
}

export interface SalaryPeriod {
    salary: {
        id: string;
        effectiveDate: Date;
        endDate: Date | null;
        monthlyGross: Prisma.Decimal;
        paye: Prisma.Decimal;
        annualBaseSalary: Prisma.Decimal;

        components: {
            name: string;
            percentage: Prisma.Decimal;
            annualAmount: Prisma.Decimal;
        }[];

        additionalEarnings: {
            name: string;
            amount: Prisma.Decimal;
            calculationType: "FIXED" | "PERCENTAGE";
            percentage: Prisma.Decimal | null;
            calculationBase: Prisma.Decimal | null;
            calculationBaseType: string | null;
            frequency: "MONTHLY" | "ANNUAL" | "ONE_TIME";
        }[];
    };

    startDate: Date;
    endDate: Date;
    days: number;
}


export interface GetPayrollsInput {
    page: number;
    limit: number;
    year?: number;
    month?: number;
    status?: MonthlyPayrollStatus;

}