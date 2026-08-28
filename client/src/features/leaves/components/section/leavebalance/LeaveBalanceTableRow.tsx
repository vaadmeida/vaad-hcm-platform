import {
    Avatar,
    AvatarFallback,
} from "@/components/ui/avatar";
import type { LeaveBalanceItem } from "../../../types/leave.types";
import { ChevronDown } from "lucide-react";
import { Fragment, useState } from "react";
import { useGetEmployeeLeaveBalance } from "@/features/leaves/hooks/useGetEmployeeBalance";
import EmployeeLeaveBalanceTable from "./EmployeeLeaveBalanceTable";
import EmployeeLeaveBalanceCard from "./EmployeeLeaveBalanceCard";

interface LeaveBalanceTableRowProps {
    employee: LeaveBalanceItem;
}

const LeaveBalanceTableRow = ({
    employee,
}: LeaveBalanceTableRowProps) => {
    const [isOpen, setIsOpen] = useState(false);

    const { data, isLoading } = useGetEmployeeLeaveBalance(
        employee.employee.id,
        {
            enabled: isOpen,
        }
    );

    const employeeName = `${employee.employee.first_name} ${employee.employee.last_name}`;

    const initials = employeeName
        .split(" ")
        .map((name) => name.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase();

    const visibleTypes = employee.leave_types_used?.slice(0, 2) ?? [];
    const remainingTypes = Math.max((employee.leave_types_used?.length ?? 0) - 2, 0);

    const formatLeaveType = (type: string) =>
        type.replace(/\s+Leave$/i, "");

    return (
        <Fragment>
            <tr className="last:border-none hover:bg-gray-50">
                {/* Employee */}
                <td className="px-3 py-3">
                    <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-[#1078A9]/10 text-xs font-medium text-[#1078A9]">
                                {initials}
                            </AvatarFallback>
                        </Avatar>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-gray-900">
                                {employeeName}
                            </p>

                            <p className="truncate text-xs text-muted-foreground">
                                {employee.active_types_used}{" "}
                                {employee.active_types_used === 1
                                    ? "active type used"
                                    : "active types used"}
                            </p>
                        </div>
                    </div>
                </td>

                {/* Department */}
                <td className="hidden px-3 py-3 xl:table-cell">
                    <span className="text-sm text-gray-700">
                        {employee.employee.department?.name ?? "—"}
                    </span>
                </td>

                {/* Total Used */}
                <td className="px-3 py-3">
                    <span className="font-medium text-gray-900">
                        {employee.total_used}d
                    </span>
                </td>

                {/* Leave Types */}

                <td className="hidden px-3 py-3 xl:table-cell">
                    {(employee.leave_types_used?.length ?? 0) === 0 ? (
                        <span className="text-xs text-muted-foreground">
                            No leave used
                        </span>
                    ) : (
                        <div className="flex max-w-60 items-center gap-1 overflow-hidden">
                            {visibleTypes.map((type) => (
                                <span
                                    key={type}
                                    title={type}
                                    className="max-w-22.5 truncate text-sm text-gray-700"
                                >
                                    {formatLeaveType(type)}
                                </span>
                            ))}

                            {remainingTypes > 0 && (
                                <span className="shrink-0 text-xs text-muted-foreground">
                                    + {remainingTypes}{" "}
                                    {remainingTypes === 1 ? "other" : "others"}
                                </span>
                            )}
                        </div>
                    )}
                </td>

                {/* Actions */}
                <td className="px-3 py-3 text-right">
                    <button
                        type="button"
                        onClick={() => setIsOpen((prev) => !prev)}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#1078A9]/20 bg-[#1078A9]/5 px-3 py-1.5 text-xs font-medium text-[#1078A9] transition hover:border-[#1078A9]/30 hover:bg-[#1078A9]/10"
                    >
                        {isOpen ? "Close" : "View"}

                        <ChevronDown
                            className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""
                                }`}
                        />
                    </button>
                </td>
            </tr>

            {isOpen && (
                <tr className="bg-gray-50">
                    <td colSpan={5} className="px-3 py-4">
                        {isLoading ? (
                            <div className="py-4 text-center text-sm text-muted-foreground">
                                Loading leave balance...
                            </div>
                        ) : (
                            <>
                                {/* Desktop / Tablet */}
                                <div className="hidden md:block">
                                    <EmployeeLeaveBalanceTable
                                        balances={data?.data.balances ?? []}
                                    />
                                </div>

                                {/* Mobile */}
                                <div className="md:hidden">
                                    <EmployeeLeaveBalanceCard
                                        balances={data?.data.balances ?? []}
                                    />
                                </div>
                            </>
                        )}
                    </td>
                </tr>
            )}
        </Fragment>
    );
};

export default LeaveBalanceTableRow;