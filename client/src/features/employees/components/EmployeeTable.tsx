import type { Employee } from "../types/employee.types";
import EmployeeTableRow from "./EmployeeTableRow";
interface EmployeeTableProps {
  employees: Employee[];
}

const EmployeeTable = ({
  employees,
}: EmployeeTableProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-y border-border bg-muted/10 text-left text-xs font-medium text-muted-foreground">

            <th className="px-4 py-3 pr-2">
              Employee
            </th>

            <th className="px-4 py-3 pl-3">
              Department
            </th>

            <th className="hidden px-4 py-3 xl:table-cell">
              Email
            </th>

            <th className="px-4 py-3">
              Status
            </th>

            <th className="hidden px-4 py-3 pl-3 xl:table-cell">
              Manager
            </th>

            <th className="px-4 py-3 text-right">
              Actions
            </th>

          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {employees.map((employee) => (
            <EmployeeTableRow
              key={employee.id}
              employee={employee}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTable;