-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "employee_documents"
ALTER COLUMN "status" DROP DEFAULT,
ALTER COLUMN "status" SET NOT NULL,
ALTER COLUMN "status" TYPE "DocumentStatus" USING ("status"::"DocumentStatus"),
ALTER COLUMN "status" SET DEFAULT 'pending';