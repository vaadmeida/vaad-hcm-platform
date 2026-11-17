-- AlterTable
ALTER TABLE "MonthlyPayroll" ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedBy" UUID;
