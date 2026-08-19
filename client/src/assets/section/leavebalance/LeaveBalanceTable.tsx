import type { LeaveBalanceItem } from "../../../types/leave.types";
import LeaveBalanceTableRow from "./LeaveBalanceTableRow";

interface LeaveBalanceTableProps {
  employees: LeaveBalanceItem[];
}

const LeaveBalanceTable = ({
  employees,
}: LeaveBalanceTableProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-y border-border bg-muted/10 text-left text-xs font-medium text-muted-foreground">
            
            <th className="px-4 py-3 pr-2">
              Employee
            </th>

            <th className="hidden px-4 py-3 xl:table-cell">
              Department
            </th>

            <th className="px-4 py-3">
              Total Used
            </th>

            <th className="hidden px-4 py-3 xl:table-cell">
              Leave Types
            </th>

            <th className="px-4 py-3 text-right">
              Actions
            </th>

          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {employees.map((employee) => (
            <LeaveBalanceTableRow
              key={employee.employee.id}
              employee={employee}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LeaveBalanceTable;