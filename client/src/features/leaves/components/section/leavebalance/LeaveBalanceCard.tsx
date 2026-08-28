import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { LeaveBalanceItem } from "../../../types/leave.types";
import { useGetEmployeeLeaveBalance } from "@/features/leaves/hooks/useGetEmployeeBalance";
import EmployeeLeaveBalanceCard from "./EmployeeLeaveBalanceCard";

interface LeaveBalanceCardProps {
  employee: LeaveBalanceItem;
}

const LeaveBalanceCard = ({
  employee,
}: LeaveBalanceCardProps) => {
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
    <div className="mb-3 rounded-xl border border-border bg-white px-4 py-4 last:mb-0">
      <div className="flex items-start justify-between gap-3">
        {/* Employee */}
        <div className="flex min-w-0 items-center gap-3">
          <Avatar className="h-10 w-10 shrink-0">
            <AvatarFallback className="bg-[#1078A9]/10 text-xs font-medium text-[#1078A9]">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">
              {employeeName}
            </p>

            <p className="text-xs text-muted-foreground">
              {employee.active_types_used}{" "}
              {employee.active_types_used === 1
                ? "active type used"
                : "active types used"}
            </p>
          </div>
        </div>

        {/* Total Used */}
        <div className="shrink-0 text-right">
          <p className="text-sm font-semibold text-gray-900">
            {employee.total_used}d
          </p>

          <p className="text-[11px] text-muted-foreground">
            Total used
          </p>
        </div>
      </div>

      {/* Department */}
      <div className="mt-3">
        <p className="text-xs text-muted-foreground">
          Department
        </p>

        <p className="mt-0.5 text-sm text-gray-700">
          {employee.employee.department?.name ?? "—"}
        </p>
      </div>

      {/* Leave Types */}
      <div className="mt-3">
        <p className="text-xs text-muted-foreground">
          Leave types
        </p>

        {(employee.leave_types_used?.length ?? 0) === 0 ? (
          <p className="mt-0.5 text-sm text-muted-foreground">
            No leave used
          </p>
        ) : (
          <div className="mt-1 flex items-center gap-1">
            {visibleTypes.map((type) => (
              <span
                key={type}
                title={type}
                className="max-w-27.5 truncate text-sm text-gray-700"
              >
                {formatLeaveType(type)}
              </span>
            ))}

            {remainingTypes > 0 && (
              <span className="shrink-0 text-xs text-muted-foreground">
                +{remainingTypes}{" "}
                {remainingTypes === 1 ? "other" : "others"}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Action */}
      <div className="mt-4 flex justify-end">
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
      </div>

      {/* Expanded Details */}
      {isOpen && (
        <div className="mt-4">
          {isLoading ? (
            <div className="py-4 text-center text-sm text-muted-foreground">
              Loading leave balance...
            </div>
          ) : (
            <EmployeeLeaveBalanceCard
              balances={data?.data.balances ?? []}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default LeaveBalanceCard;