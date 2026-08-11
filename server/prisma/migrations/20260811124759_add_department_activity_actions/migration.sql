/*
  Warnings:

  - The values [EMPLOYEE_TRANSFERRED] on the enum `ActivityAction` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ActivityAction_new" AS ENUM ('CREATED', 'UPDATED', 'DELETED', 'STATUS_CHANGED', 'DEPARTMENT_ASSIGNED', 'DEPARTMENT_REMOVED', 'MANAGER_ASSIGNED', 'MANAGER_REMOVED', 'EMPLOYEE_ADDED', 'EMPLOYEE_REMOVED', 'LEAVE_APPROVED', 'LEAVE_REJECTED', 'LEAVE_CANCELLED', 'LOGIN', 'LOGOUT');
ALTER TABLE "ActivityLog" ALTER COLUMN "action" TYPE "ActivityAction_new" USING ("action"::text::"ActivityAction_new");
ALTER TYPE "ActivityAction" RENAME TO "ActivityAction_old";
ALTER TYPE "ActivityAction_new" RENAME TO "ActivityAction";
DROP TYPE "ActivityAction_old";
COMMIT;
