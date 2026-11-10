CREATE UNIQUE INDEX "EmployeeSalary_one_active_per_employee"
ON "EmployeeSalary" ("employeeId")
WHERE "endDate" IS NULL;