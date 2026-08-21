import type { LeaveBalance } from "@/features/leaves/types/leave.types";

interface LeaveBalanceTableRowProps {
    balance: LeaveBalance;
}

const LeaveBalanceTableRow = ({
    balance,
}: LeaveBalanceTableRowProps) => {
    return (
        <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50/50">
            <td className="px-5 py-4">
                <div className="min-w-45">
                    <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-medium text-gray-900">
                            {balance.leaveType.name}
                        </p>

                        <span className="text-xs font-medium text-gray-500">
                            {Math.round(balance.usage_percentage)}%
                        </span>
                    </div>

                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div
                            className="h-full rounded-full bg-[#1078A9] transition-all"
                            style={{
                                width: `${Math.min(balance.usage_percentage, 100)}%`,
                            }}
                        />
                    </div>
                </div>
            </td>
            <td className="px-5 py-4">
                <span className="text-sm font-semibold text-gray-900">
                    {balance.remaining > 0
                        ? `${balance.remaining} days`
                        : "—"}
                </span>
            </td>

            <td className="px-5 py-4">
                <span className="text-sm text-gray-600">
                    {balance.used} {balance.used === 1 ? "day" : "days"}
                </span>
            </td>

            <td className="px-5 py-4">
                <span className="text-sm text-gray-600">
                    {balance.pending}{" "}
                    {balance.pending === 1 ? "day" : "days"}
                </span>
            </td>
        </tr>
    );
};

export default LeaveBalanceTableRow;