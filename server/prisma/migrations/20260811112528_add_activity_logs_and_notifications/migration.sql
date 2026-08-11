-- CreateEnum
CREATE TYPE "ActivityEntity" AS ENUM ('DEPARTMENT', 'EMPLOYEE', 'LEAVE', 'DOCUMENT', 'ATTENDANCE', 'PAYSLIP', 'AUTH');

-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('CREATED', 'UPDATED', 'DELETED', 'STATUS_CHANGED', 'MANAGER_ASSIGNED', 'MANAGER_REMOVED', 'EMPLOYEE_ADDED', 'EMPLOYEE_REMOVED', 'LEAVE_APPROVED', 'LEAVE_REJECTED', 'LEAVE_CANCELLED', 'LOGIN', 'LOGOUT');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('LEAVE', 'DOCUMENT', 'ATTENDANCE', 'PAYSLIP', 'DEPARTMENT', 'EMPLOYEE', 'SYSTEM');

-- CreateTable
CREATE TABLE "ActivityLog" (
    "id" TEXT NOT NULL,
    "action" "ActivityAction" NOT NULL,
    "entity_type" "ActivityEntity" NOT NULL,
    "entity_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "performed_by" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ActivityLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "user_id" UUID NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read_at" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ActivityLog_entity_type_entity_id_idx" ON "ActivityLog"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "ActivityLog_performed_by_idx" ON "ActivityLog"("performed_by");

-- CreateIndex
CREATE INDEX "ActivityLog_created_at_idx" ON "ActivityLog"("created_at");

-- CreateIndex
CREATE INDEX "Notification_user_id_is_read_idx" ON "Notification"("user_id", "is_read");

-- CreateIndex
CREATE INDEX "Notification_created_at_idx" ON "Notification"("created_at");

-- AddForeignKey
ALTER TABLE "ActivityLog" ADD CONSTRAINT "ActivityLog_performed_by_fkey" FOREIGN KEY ("performed_by") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "employees"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
