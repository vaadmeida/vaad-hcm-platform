import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import type { LeaveRequest } from "../../../types/leave.types";

interface LeaveRequestTableRowProps {
  request: LeaveRequest;
}

const LeaveRequestTableRow = ({
  request,
}: LeaveRequestTableRowProps) => {
  const employeeName = request.employee.name;

  const initials = employeeName
    .split(" ")
    .map((name: string) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
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
              {request.employee.email}
            </p>
          </div>
        </div>
      </td>

      {/* Leave Type */}
      <td className="px-3 py-3">
        <span className="font-medium text-gray-900">
          {request.leaveType.name}
        </span>
      </td>

      {/* Start - End */}
      <td className="hidden px-3 py-3 xl:table-cell">
        <span className="whitespace-nowrap text-sm">
          {formatDate(request.start_date)} –{" "}
          {formatDate(request.end_date)}
        </span>
      </td>

      {/* Status */}
      <td className="hidden px-3 py-3 xl:table-cell">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${getStatusStyles(
            request.status
          )}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              request.status === "approved"
                ? "bg-green-500"
                : request.status === "pending"
                ? "bg-amber-500"
                : "bg-red-500"
            }`}
          />

          {request.status}
        </span>
      </td>

      {/* Actions */}
      <td className="px-3 py-3 text-right">
        {request.status === "pending" ? (
          <div className="flex justify-end gap-2">
            <button
              type="button"
              title="Reject leave request"
              className="flex h-8 w-8 items-center justify-center rounded-md text-red-600 transition hover:bg-red-50"
            >
              ✕
            </button>

            <button
              type="button"
              title="Approve leave request"
              className="flex h-8 w-8 items-center justify-center rounded-md text-green-600 transition hover:bg-green-50"
            >
              ✓
            </button>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">
            —
          </span>
        )}
      </td>

    </tr>
  );
};

export default LeaveRequestTableRow;