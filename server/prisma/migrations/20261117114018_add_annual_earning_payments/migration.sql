-- CreateEnum
CREATE TYPE "AnnualEarningType" AS ENUM ('THIRTEENTH_MONTH', 'LEAVE_ALLOWANCE');

-- CreateEnum
CREATE TYPE "AnnualEarningStatus" AS ENUM ('PENDING', 'PAID');

-- CreateTable
CREATE TABLE "annual_earning_payments" (
    "id" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "type" "AnnualEarningType" NOT NULL,
    "year" INTEGER NOT NULL,
    "amount" DECIMAL(15,2) NOT NULL,
    "status" "AnnualEarningStatus" NOT NULL DEFAULT 'PENDING',
    "payrollId" UUID,
    "paidAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "annual_earning_payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "annual_earning_payments_payrollId_idx" ON "annual_earning_payments"("payrollId");

-- CreateIndex
CREATE INDEX "annual_earning_payments_year_type_status_idx" ON "annual_earning_payments"("year", "type", "status");

-- CreateIndex
CREATE UNIQUE INDEX "annual_earning_payments_employeeId_type_year_key" ON "annual_earning_payments"("employeeId", "type", "year");

-- AddForeignKey
ALTER TABLE "annual_earning_payments" ADD CONSTRAINT "annual_earning_payments_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "annual_earning_payments" ADD CONSTRAINT "annual_earning_payments_payrollId_fkey" FOREIGN KEY ("payrollId") REFERENCES "MonthlyPayroll"("id") ON DELETE SET NULL ON UPDATE CASCADE;
