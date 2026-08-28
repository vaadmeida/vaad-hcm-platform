import type { LeaveBalance } from "@/features/leaves/types/leave.types";

interface MyLeaveBalanceTableRowProps {
    balance: LeaveBalance;
}

const MyLeaveBalanceTableRow = ({
    balance,
}: MyLeaveBalanceTableRowProps) => {
    const leaveType =
        typeof balance.leaveType === "string" ? balance.leaveType
            : balance.leaveType?.name ?? "Unknown Leave";

    return (
        <tr className="hover:bg-gray-50">
            {/* Leave Type */}
            <td className="px-4 py-4">
                <div>
                    <p className="font-medium text-gray-900">
                        {leaveType.replace(/\s+Leave$/i, "")}
                    </p>
                </div>
            </td>

            {/* Allocated */}
            <td className="px-4 py-4 text-gray-700">
                {balance.allocated}d
            </td>

            {/* Used */}
            <td className="px-4 py-4">
                <span className="font-medium text-gray-900">
                    {balance.used}d
                </span>
            </td>

            {/* Remaining */}
            <td className="px-4 py-4">
                <span
                    className={
                        balance.remaining > 0
                            ? "font-medium text-green-600"
                            : "font-medium text-gray-500"
                    }
                >
                    {balance.remaining}d
                </span>
            </td>

            {/* Year */}
            <td className="hidden px-4 py-4 text-gray-700 xl:table-cell">
                {balance.year}
            </td>
        </tr>
    );
};

export default MyLeaveBalanceTableRow;