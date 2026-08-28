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
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        {/* Employee Information */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          {employee.avatar_url ? (
            <img
              src={employee.avatar_url}
              alt={`${employee.first_name} ${employee.last_name}`}
              className="h-12 w-12 rounded-full object-cover ring-4 ring-[#1078A9]/10"
            />
          ) : (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#1078A9]/10 text-sm font-semibold text-[#1078A9] ring-4 ring-[#1078A9]/5">
              {initials}
            </div>
          )}

          {/* Details */}
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-semibold tracking-tight text-[#121417]">
                My Leave
              </h1>

              <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                {year} Leave Year
              </span>
            </div>

            <p className="mt-1 text-sm font-semibold text-gray-800">
              {employee.first_name} {employee.last_name}
            </p>

            <p className="mt-0.5 text-xs text-gray-500">
              View and manage your leave balances and requests
            </p>
          </div>
        </div>

        {/* Request Leave */}
        <div className="shrink-0">
          <RequestLeaveDialog />
        </div>
      </div>
    </div>
  );
};

export default MyLeaveHeader;