import type { LeaveBalance } from "@/features/leaves/types/leave.types";
import MyLeaveBalanceTableRow from "./MyLeaveBalanceTableRow";


interface MyLeaveBalanceTableProps {
  balances: LeaveBalance[];
  year?: number;
}

const MyLeaveBalanceTable = ({
  balances }: MyLeaveBalanceTableProps) => {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border bg-white">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/10 text-left text-xs font-medium text-muted-foreground">
            <th className="px-4 py-3">Leave Type</th>
            <th className="px-4 py-3">Allocated</th>
            <th className="px-4 py-3">Used</th>
            <th className="px-4 py-3">Remaining</th>
            <th className="hidden px-4 py-3 xl:table-cell">Year</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {balances.length > 0 ? (
            balances.map((balance) => (
              <MyLeaveBalanceTableRow
                key={`${balance.leaveType.id}-${balance.year}`}
                balance={balance}
              />
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="px-4 py-8 text-center text-sm text-muted-foreground"
              >
                No leave balance available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyLeaveBalanceTable;