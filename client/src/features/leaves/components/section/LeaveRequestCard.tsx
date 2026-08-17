import {
  Avatar,
  AvatarFallback,

} from "@/components/ui/avatar";
import type { LeaveRequest } from "../../types/leave.types";


interface LeaveRequestCardProps {
  request: LeaveRequest;
}

const LeaveRequestCard = ({
  request,
}: LeaveRequestCardProps) => {
  const employeeName = request.employee.name;

  const initials = employeeName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const startDate = new Date(
    request.start_date
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const endDate = new Date(
    request.end_date
  ).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-700";

      case "pending":
        return "bg-amber-50 text-amber-700";

      case "rejected":
        return "bg-red-50 text-red-700";

      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  return (
    <div className="my-3 rounded-lg border border-border bg-white p-4 shadow-sm transition-shadow duration-300 hover:shadow-md">

      {/* Header */}
      <div className="flex items-center gap-3">

        <Avatar className="h-12 w-12">
          <AvatarFallback>
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {employeeName}
          </h3>

          <p className="truncate text-xs text-muted-foreground">
            {request.employee.email}
          </p>
        </div>

        {/* Status */}
        <span
          className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${getStatusStyles(
            request.status
          )}`}
        >
          {request.status}
        </span>
      </div>

      {/* Details */}
      <div className="mt-4 space-y-2 text-sm">

        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">
            Leave Type
          </span>

          <span className="font-medium text-right">
            {request.leaveType.name}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">
            Duration
          </span>

          <span className="font-medium text-right">
            {request.total_days} days
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">
            Start Date
          </span>

          <span className="font-medium text-right">
            {startDate}
          </span>
        </div>

        <div className="flex justify-between gap-4">
          <span className="text-muted-foreground">
            End Date
          </span>

          <span className="font-medium text-right">
            {endDate}
          </span>
        </div>

        {request.reason && (
          <div className="border-t border-border pt-2">
            <p className="text-xs text-muted-foreground">
              Reason
            </p>

            <p className="mt-1 text-sm text-foreground">
              {request.reason}
            </p>
          </div>
        )}

      </div>

      {/* Actions */}
      {request.status === "pending" && (
        <div className="mt-4 flex justify-end gap-2 border-t border-border pt-3">
          <button
            type="button"
            className="rounded-md px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
          >
            Reject
          </button>

          <button
            type="button"
            className="rounded-md bg-[#1078A9] px-3 py-2 text-sm font-medium text-white transition hover:bg-[#0d658e]"
          >
            Approve
          </button>
        </div>
      )}

    </div>
  );
};

export default LeaveRequestCard;