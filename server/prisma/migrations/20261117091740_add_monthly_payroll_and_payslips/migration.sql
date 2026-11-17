/*
  Warnings:

  - The primary key for the `OnboardingMaterial` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- CreateEnum
CREATE TYPE "MonthlyPayrollStatus" AS ENUM ('DRAFT', 'CALCULATED', 'REVIEWED', 'APPROVED', 'PROCESSED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PayslipStatus" AS ENUM ('PENDING', 'GENERATED', 'FAILED');

-- AlterTable
ALTER TABLE "OnboardingMaterial" DROP CONSTRAINT "OnboardingMaterial_pkey",
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "OnboardingMaterial_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyPayroll" (
    "id" UUID NOT NULL,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "periodStart" TIMESTAMP(3) NOT NULL,
    "periodEnd" TIMESTAMP(3) NOT NULL,
    "status" "MonthlyPayrollStatus" NOT NULL DEFAULT 'DRAFT',
    "totalEmployees" INTEGER NOT NULL DEFAULT 0,
    "totalGross" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalEarnings" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalPaye" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalDeductions" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "totalNetPay" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "preparedBy" UUID,
    "approvedBy" UUID,
    "processedBy" UUID,
    "preparedAt" TIMESTAMP(3),
    "approvedAt" TIMESTAMP(3),
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyPayroll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyPayrollEmployee" (
    "id" UUID NOT NULL,
    "payrollId" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "employeeName" TEXT NOT NULL,
    "employeeNumber" TEXT,
    "employeeEmail" TEXT,
    "jobTitle" TEXT,
    "departmentNames" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "annualBaseSalary" DECIMAL(15,2) NOT NULL,
    "monthlyGross" DECIMAL(15,2) NOT NULL,
    "additionalEarnings" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "grossPay" DECIMAL(15,2) NOT NULL,
    "paye" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "otherDeductions" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "netPay" DECIMAL(15,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyPayrollEmployee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollEmployeeComponent" (
    "id" UUID NOT NULL,
    "payrollEmployeeId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "percentage" DECIMAL(5,2) NOT NULL,
    "annualAmount" DECIMAL(15,2) NOT NULL,
    "monthlyAmount" DECIMAL(15,2) NOT NULL,

    CONSTRAINT "PayrollEmployeeComponent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PayrollEmployeeEarning" (
    "id" UUID NOT NULL,
    "payrollEmployeeId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "calculationType" "EarningCalculationType" NOT NULL,
    "percentage" DECIMAL(5,2),
    "calculationBase" DECIMAL(15,2),
    "calculationBaseType" "CalculationBaseType",
    "frequency" "EarningFrequency" NOT NULL,

    CONSTRAINT "PayrollEmployeeEarning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payslip" (
    "id" UUID NOT NULL,
    "payrollEmployeeId" UUID NOT NULL,
    "status" "PayslipStatus" NOT NULL DEFAULT 'PENDING',
    "fileName" TEXT,
    "storageKey" TEXT,
    "mimeType" TEXT DEFAULT 'application/pdf',
    "generatedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payslip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_tokenHash_key" ON "password_reset_tokens"("tokenHash");

-- CreateIndex
CREATE INDEX "password_reset_tokens_employeeId_idx" ON "password_reset_tokens"("employeeId");

-- CreateIndex
CREATE INDEX "password_reset_tokens_expiresAt_idx" ON "password_reset_tokens"("expiresAt");

-- CreateIndex
CREATE INDEX "MonthlyPayroll_status_idx" ON "MonthlyPayroll"("status");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyPayroll_year_month_key" ON "MonthlyPayroll"("year", "month");

-- CreateIndex
CREATE INDEX "MonthlyPayrollEmployee_employeeId_idx" ON "MonthlyPayrollEmployee"("employeeId");

-- CreateIndex
CREATE INDEX "MonthlyPayrollEmployee_payrollId_idx" ON "MonthlyPayrollEmployee"("payrollId");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyPayrollEmployee_payrollId_employeeId_key" ON "MonthlyPayrollEmployee"("payrollId", "employeeId");

-- CreateIndex
CREATE INDEX "PayrollEmployeeComponent_payrollEmployeeId_idx" ON "PayrollEmployeeComponent"("payrollEmployeeId");

-- CreateIndex
CREATE INDEX "PayrollEmployeeEarning_payrollEmployeeId_idx" ON "PayrollEmployeeEarning"("payrollEmployeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Payslip_payrollEmployeeId_key" ON "Payslip"("payrollEmployeeId");

-- CreateIndex
CREATE INDEX "Payslip_status_idx" ON "Payslip"("status");

-- AddForeignKey
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyPayrollEmployee" ADD CONSTRAINT "MonthlyPayrollEmployee_payrollId_fkey" FOREIGN KEY ("payrollId") REFERENCES "MonthlyPayroll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyPayrollEmployee" ADD CONSTRAINT "MonthlyPayrollEmployee_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollEmployeeComponent" ADD CONSTRAINT "PayrollEmployeeComponent_payrollEmployeeId_fkey" FOREIGN KEY ("payrollEmployeeId") REFERENCES "MonthlyPayrollEmployee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PayrollEmployeeEarning" ADD CONSTRAINT "PayrollEmployeeEarning_payrollEmployeeId_fkey" FOREIGN KEY ("payrollEmployeeId") REFERENCES "MonthlyPayrollEmployee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payslip" ADD CONSTRAINT "Payslip_payrollEmployeeId_fkey" FOREIGN KEY ("payrollEmployeeId") REFERENCES "MonthlyPayrollEmployee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
