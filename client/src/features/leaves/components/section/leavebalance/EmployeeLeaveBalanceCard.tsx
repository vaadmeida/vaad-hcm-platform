import type { EmployeeLeaveBalance } from "../../../types/leave.types";

interface EmployeeLeaveBalanceCardProps {
  balances: EmployeeLeaveBalance[];
}

const EmployeeLeaveBalanceCard = ({
  balances,
}: EmployeeLeaveBalanceCardProps) => {
  if (balances.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-white p-4 text-center text-sm text-muted-foreground">
        No leave balances found.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {balances.map((balance) => (
        <div
          key={balance.id}
          className="rounded-lg border border-border bg-white p-4"
        >
          {/* Leave Type */}
          <div className="mb-4 flex items-center justify-between">
            <p className="font-medium text-gray-900">
              {balance.leaveType.name}
            </p>

            <span className="text-xs text-muted-foreground">
              {balance.year}
            </span>
          </div>

          {/* Balance Details */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <p className="text-xs text-muted-foreground">
                Allocated
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {balance.allocated}d
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Used
              </p>

              <p className="mt-1 text-sm font-semibold text-gray-900">
                {balance.used}d
              </p>
            </div>

            <div>
              <p className="text-xs text-muted-foreground">
                Remaining
              </p>

              <p className="mt-1 text-sm font-semibold text-[#1078A9]">
                {balance.remaining}d
              </p>
            </div>
          </div>

          {/* Pending */}
          {balance.pending > 0 && (
            <div className="mt-3 border-t border-border pt-3">
              <p className="text-xs text-muted-foreground">
                Pending
              </p>

              <p className="mt-1 text-sm font-medium text-amber-600">
                {balance.pending}d
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default EmployeeLeaveBalanceCard;