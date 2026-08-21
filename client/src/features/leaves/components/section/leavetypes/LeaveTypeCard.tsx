import { MoreVertical} from "lucide-react";

import { Button } from "@/components/ui/button";
import type { LeaveType } from "@/features/leaves/types/leave.types";



interface LeaveTypeCardProps {
  leaveType: LeaveType;
}

const LeaveTypeCard = ({ leaveType }: LeaveTypeCardProps) => {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-gray-900">
            {leaveType.name}
          </h3>

          <p className="mt-1 text-xs text-gray-500">
            {leaveType.default_days_per_year !== null
              ? `${leaveType.default_days_per_year} days per year`
              : "No yearly limit"}
          </p>
        </div>

        {/* Actions */}
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-gray-500 hover:bg-gray-100"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </div>

      {/* Details */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <div>
          <p className="text-[11px] text-gray-400">Type</p>

          <span
            className={`mt-1 inline-flex rounded-full px-2 py-1 text-xs font-medium ${
              leaveType.is_paid
                ? "bg-green-50 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {leaveType.is_paid ? "Paid" : "Unpaid"}
          </span>
        </div>

        <div>
          <p className="text-[11px] text-gray-400">Document</p>

          <p className="mt-1 text-xs font-medium text-gray-700">
            {leaveType.requires_document ? "Required" : "Not required"}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-gray-400">Carry Over</p>

          <p className="mt-1 text-xs font-medium text-gray-700">
            {leaveType.carries_over
              ? `Up to ${leaveType.max_carryover_days} days`
              : "Not allowed"}
          </p>
        </div>

        <div>
          <p className="text-[11px] text-gray-400">Status</p>

          <span className="mt-1 inline-flex rounded-full bg-green-50 px-2 py-1 text-xs font-medium text-green-700">
            Active
          </span>
        </div>
      </div>
    </div>
  );
};

export default LeaveTypeCard;