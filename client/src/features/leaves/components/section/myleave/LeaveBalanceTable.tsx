import type { LeaveBalance } from "@/features/leaves/types/leave.types";
import LeaveBalanceTableRow from "./LeaveBalanceTableRow";

interface LeaveBalanceTableProps {
  balances: LeaveBalance[];
  year?: number;
}

const LeaveBalanceTable = ({
  balances,
  year,
}: LeaveBalanceTableProps) => {
  return (
    <section className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              My Leave Balances
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              Your available leave balances for the current year.
            </p>
          </div>

          {year && (
            <span className="shrink-0 text-sm font-medium text-gray-500">
              {year}
            </span>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-150 text-left">
          <thead className="border-b border-gray-100 bg-gray-50/70">
            <tr>
              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Leave Type
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Remaining
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Used
              </th>

              <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                Pending
              </th>
            </tr>
          </thead>

          <tbody>
            {balances.map((balance) => (
              <LeaveBalanceTableRow
                key={balance.id}
                balance={balance}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {balances.length === 0 && (
        <div className="px-5 py-10 text-center">
          <p className="text-sm text-gray-500">
            No leave balances available for this year.
          </p>
        </div>
      )}
    </section>
  );
};

export default LeaveBalanceTable;