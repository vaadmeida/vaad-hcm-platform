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

  const { data: allBalances } = useGetAllLeaveBalances(filters, {
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

        {/* Tablet + Desktop */}
        <div className="hidden md:block">
          <LeaveBalanceTable employees={balances} />
        </div>

        {/* Mobile */}
        <div className="md:hidden mt-6">
          {balances.map((employee) => (
            <LeaveBalanceCard
              key={employee.employee.id}
              employee={employee}
            />
          ))}
        </div>

        {!isManager && allBalances?.pagination && (
          <LeaveBalanceTablePagination
            pagination={allBalances.pagination}
            onPageChange={setPage}
          />
        )}
      </section>
    </div>
  );
};

export default LeaveBalances;