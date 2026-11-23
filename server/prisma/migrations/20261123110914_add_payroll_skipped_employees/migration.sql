-- AlterTable
ALTER TABLE "MonthlyPayroll" ADD COLUMN     "skippedEmployees" JSONB NOT NULL DEFAULT '[]';
