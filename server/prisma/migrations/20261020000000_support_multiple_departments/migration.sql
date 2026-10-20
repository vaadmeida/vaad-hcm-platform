
BEGIN;

-- 1. Create the employee-department join table.
CREATE TABLE "employee_departments" (
    "employee_id" UUID NOT NULL,
    "department_id" UUID NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "employee_departments_pkey"
        PRIMARY KEY ("employee_id", "department_id")
);

-- 2. Preserve all existing department assignments.
INSERT INTO "employee_departments" (
    "employee_id",
    "department_id",
    "assigned_at"
)
SELECT
    "id",
    "department_id",
    CURRENT_TIMESTAMP
FROM "employees"
WHERE "department_id" IS NOT NULL
ON CONFLICT ("employee_id", "department_id") DO NOTHING;

-- 3. Remove the old employee-to-department relationship.
ALTER TABLE "employees"
    DROP CONSTRAINT "employees_department_id_fkey";

ALTER TABLE "employees"
    DROP COLUMN "department_id";

-- 4. Allow a manager to lead multiple departments.
-- The existing manager foreign key remains in place.
DROP INDEX "departments_manager_id_key";

-- 5. Add the join-table index and foreign keys.
CREATE INDEX "employee_departments_department_id_idx"
    ON "employee_departments"("department_id");

ALTER TABLE "employee_departments"
    ADD CONSTRAINT "employee_departments_employee_id_fkey"
    FOREIGN KEY ("employee_id")
    REFERENCES "employees"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;

ALTER TABLE "employee_departments"
    ADD CONSTRAINT "employee_departments_department_id_fkey"
    FOREIGN KEY ("department_id")
    REFERENCES "departments"("id")
    ON DELETE CASCADE
    ON UPDATE CASCADE;

COMMIT;
