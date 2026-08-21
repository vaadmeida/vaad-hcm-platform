import type { LeaveBalanceEmployee } from "@/features/leaves/types/leave.types";
import RequestLeaveDialog from "./RequestLeaveDialog";

interface MyLeaveHeaderProps {
  employee: LeaveBalanceEmployee;
  year: number;
  onRequestLeave?: () => void;
}

const MyLeaveHeader = ({
  employee,
  year,
}: MyLeaveHeaderProps) => {
  const initials = `${employee.first_name.charAt(0)}${employee.last_name.charAt(0)}`;

  return (
    <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
      {/* Employee Information */}
      <div className="flex items-center gap-3">
        {employee.avatar_url ? (
          <img
            src={employee.avatar_url}
            alt={`${employee.first_name} ${employee.last_name}`}
            className="h-11 w-11 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1078A9] text-sm font-semibold text-white">
            {initials}
          </div>
        )}

        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold text-gray-900">
              My Leave
            </h1>

            <span className="text-gray-300">•</span>

            <span className="text-sm font-medium text-gray-500">
              Leave Year {year}
            </span>
          </div>

          <p className="mt-0.5 text-sm font-medium text-gray-800">
            {employee.first_name} {employee.last_name}
          </p>

          <p className="text-xs text-gray-500">
            View and manage your leave balances and requests
          </p>
        </div>
      </div>

      {/* Request Leave */}
    <RequestLeaveDialog/>
    </div>
  );
};

export default MyLeaveHeader;