import type { EmployeeLeaveBalance } from "@/features/leaves/types/leave.types";


interface EmployeeLeaveBalanceTableProps {
  balances: EmployeeLeaveBalance[];
}

const EmployeeLeaveBalanceTable = ({
  balances,
}: EmployeeLeaveBalanceTableProps) => {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/10 text-left text-xs font-medium text-muted-foreground">
            <th className="px-4 py-3">
              Leave Type
            </th>

            <th className="px-4 py-3 text-right">
              Allocated
            </th>

            <th className="px-4 py-3 text-right">
              Used
            </th>

            <th className="px-4 py-3 text-right">
              Remaining
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {balances.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-4 py-6 text-center text-sm text-muted-foreground"
              >
                No leave balances found.
              </td>
            </tr>
          ) : (
            balances.map((balance) => (
              <tr
                key={balance.id}
                className="hover:bg-gray-50"
              >
                <td className="px-4 py-3">
                  <span className="font-medium text-gray-900">
                    {balance.leaveType.name}
                  </span>
                </td>

                <td className="px-4 py-3 text-right text-gray-700">
                  {balance.allocated}d
                </td>

                <td className="px-4 py-3 text-right text-gray-700">
                  {balance.used}d
                </td>

                <td className="px-4 py-3 text-right">
                  <span className="font-medium text-gray-900">
                    {balance.remaining}d
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeLeaveBalanceTable;