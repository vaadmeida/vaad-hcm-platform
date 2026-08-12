

import { useTeamStatusBreakdown } from "../hooks/useTeamStatusBreakdown";
import type { Department } from "../types/departments.types";


interface DepartmentStatisticsProps {
  department: Department;
  departmentId: string;
}

const DepartmentStatistics = ({
  department,
  departmentId,
}: DepartmentStatisticsProps) => {
  const { data: statistics,isLoading,error} = useTeamStatusBreakdown(departmentId);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />

        <div className="mt-5 space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="flex items-center justify-between"
            >
              <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
              <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-base font-semibold text-[#121417]">
          Department Statistics
        </h2>

        <p className="mt-4 text-sm text-red-600">
          Failed to load department statistics.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Status Breakdown */}
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="text-base font-semibold text-[#121417]">
          Status Breakdown
        </h2>

        <div className="mt-4 space-y-3">
          {/* Active */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Active
            </span>

            <span className="text-sm font-semibold text-[#121417]">
              {statistics.active.count} ({statistics.active.percentage}%)
            </span>
          </div>

          {/* On Leave */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              On Leave
            </span>

            <span className="text-sm font-semibold text-[#121417]">
              {statistics.onLeave.count} ({statistics.onLeave.percentage}%)
            </span>
          </div>

          {/* Inactive */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              Inactive
            </span>

            <span className="text-sm font-semibold text-[#121417]">
              {statistics.inactive.count} ({statistics.inactive.percentage}%)
            </span>
          </div>
        </div>
      </div>

      {/* Department Info */}
      <div className="px-5 py-4">
        <h2 className="text-base font-semibold text-[#121417]">
          Department Info
        </h2>

        <div className="mt-4 space-y-3">
          {/* Name */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-500">
              Name
            </span>

            <span className="text-sm font-medium text-[#121417]">
              {department.name}
            </span>
          </div>

          {/* Manager */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-500">
              Manager
            </span>

            <span className="text-sm font-medium text-[#121417]">
              {department.manager
                ? `${department.manager.first_name} ${department.manager.last_name}`
                : "No manager"}
            </span>
          </div>

          {/* Annual Budget */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-500">
              Annual Budget
            </span>

            <span className="text-sm font-medium text-[#121417]">
              $0.9M
            </span>
          </div>

          {/* Headcount */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-500">
              Headcount
            </span>

            <span className="text-sm font-medium text-[#121417]">
              {statistics.total}
            </span>
          </div>

          {/* Status */}
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-500">
              Status
            </span>

            <span
              className={`rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${
                department.status === "active"
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {department.status}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentStatistics;