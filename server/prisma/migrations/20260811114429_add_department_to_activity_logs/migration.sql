-- AlterTable
ALTER TABLE "ActivityLog" ADD COLUMN     "department_id" UUID;

-- CreateIndex
CREATE INDEX "ActivityLog_department_id_idx" ON "ActivityLog"("department_id");

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "departments"("id") ON DELETE SET NULL ON UPDATE CASCADE;
