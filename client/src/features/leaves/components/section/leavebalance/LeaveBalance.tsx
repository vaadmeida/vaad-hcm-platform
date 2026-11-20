import { useState } from "react";
import LeaveBalanceFilters from "./LeaveBalanceFilters";
import LeaveBalanceTable from "./LeaveBalanceTable";
import {
  useGetAllLeaveBalances,
} from "@/features/leaves/hooks/useGetLeaveBalance";
import {
  useGetTeamLeaveBalances,
} from "@/features/leaves/hooks/useGetTeamBalance";
import { useAuthStore } from "@/store/auth.store";
import LeaveBalanceCard from "./LeaveBalanceCard";
import LeaveBalanceTablePagination from "./LeaveBalanceTablePagination";
import EmptyState from "@/components/common/EmptyState";

const LeaveBalances = () => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [leaveType, setLeaveType] = useState("all");
  const [page, setPage] = useState(1);

  const user = useAuthStore((state) => state.user);

  const isManager = user?.role === "manager";

  const filters = {
    search: search || undefined,
    departmentId:
      department === "all" ? undefined : department,
    leaveTypeId:
      leaveType === "all" ? undefined : leaveType,
    page,
    limit: 7,
  };

  const { data: allBalances, isError, isLoading, refetch } = useGetAllLeaveBalances(filters, {
    enabled: !isManager,
  });

  const { data: teamBalances } = useGetTeamLeaveBalances(filters, {
    enabled: isManager,
  });

  const balances = isManager
    ? teamBalances ?? []
    : allBalances?.data ?? [];

  const total = isManager
    ? teamBalances?.length ?? 0
    : allBalances?.pagination?.total ?? 0;

  const hasActiveFilters =
  search.trim() !== "" || department !== "all" || leaveType !== "all";

  
  return (
    <div>
      <section className="overflow-hidden rounded-lg lg:border lg:border-border lg:bg-white">
        <LeaveBalanceFilters
          search={search}
          onSearch={setSearch}
          department={department}
          onDepartmentChange={setDepartment}
          leaveType={leaveType}
          onLeaveTypeChange={setLeaveType}
          total={total}
        />

        {isLoading ? (
          <div className="flex min-h-40 items-center justify-center px-4" role="status">
            <p className="text-sm text-muted-foreground">Loading leave balances…</p>
          </div>
        ) : isError ? (
          <div className="flex min-h-40 flex-col items-center justify-center gap-3 px-4 text-center">
            <p className="text-sm text-red-600" role="alert">
              Couldn’t load leave balances.
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {balances.length > 0 ? (
              <>
                <div className="hidden md:block">
                  <LeaveBalanceTable employees={balances} />
                </div>

                <div className="mt-6 md:hidden">
                  {balances.map((employee) => (
                    <LeaveBalanceCard
                      key={employee.employee.id}
                      employee={employee}
                    />
                  ))}
                </div>
              </>
            ) : (
              <div className="flex min-h-40 items-center justify-center px-4 py-6 text-center">
                <EmptyState
                  title={
                    hasActiveFilters
                      ? "No matching leave balances"
                      : "No leave balances yet"
                  }
                  description={
                    hasActiveFilters
                      ? "Change your search or filters to find leave balances."
                      : "Employee leave balances will appear here once they’re available."
                  }
                />
              </div>
            )}

            {!isManager &&
              allBalances?.pagination &&
              (balances.length > 0 || page > 1) && (
                <LeaveBalanceTablePagination
                  pagination={allBalances.pagination}
                  onPageChange={setPage}
                />
              )}
          </>
        )}
      </section>
    </div>
  );
};

export default LeaveBalances;