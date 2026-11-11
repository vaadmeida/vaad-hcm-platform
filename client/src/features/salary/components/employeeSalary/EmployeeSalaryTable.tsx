
import type { EmployeeWithSalary } from "@/features/salary/types/salary.types";
import EmployeeSalaryTableRow from "./EmployeeSalaryTableRow";

interface EmployeeSalaryTableProps {
  employees: EmployeeWithSalary[];
  onViewSalary: (employeeId: string) => void;
  onReviewSalary: (employeeId: string) => void;
  onAddSalary: (employee: EmployeeWithSalary) => void;
}

const EmployeeSalaryTable = ({
  employees,
  onViewSalary,
  onReviewSalary,
  onAddSalary,
}: EmployeeSalaryTableProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-y border-border bg-muted/10 text-left text-xs font-medium text-muted-foreground">
            <th className="px-4 py-3 pr-2">Employee</th>
            <th className="hidden px-4 py-3 xl:table-cell">
              Annual Base Salary
            </th>
            <th className="hidden px-4 py-3 xl:table-cell">
              Monthly Gross
            </th>
            <th className="px-4 py-3">Net Pay</th>
            <th className="hidden px-4 py-3 xl:table-cell">
              Salary Status
            </th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {employees.map((employee) => (
            <EmployeeSalaryTableRow
              key={employee.employeeId}
              employee={employee}
              onViewSalary={onViewSalary}
              onReviewSalary={onReviewSalary}
              onAddSalary={onAddSalary}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeSalaryTable;
