import { useState } from "react";
import LeaveBalanceFilters from "./LeaveBalanceFilters";
import LeaveBalanceTable from "./LeaveBalanceTable";
import { useGetAllLeaveBalances } from "@/features/leaves/hooks/useGetLeaveBalance";
import { useGetTeamLeaveBalances } from "@/features/leaves/hooks/useGetTeamBalance";
import { useAuthStore } from "@/store/auth.store";


const LeaveBalances = () => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [leaveType, setLeaveType] = useState("all");

  const filters = {
    search: search || undefined,
    departmentId: department === "all" ? undefined : department,
    leaveTypeId: leaveType === "all" ? undefined : leaveType,
  };

    const user = useAuthStore((state) => state.user);

  const isManager = user?.role === "manager";

  const { data: allBalances } = useGetAllLeaveBalances(filters, {
    enabled: !isManager,
  });

  const { data: teamBalances } = useGetTeamLeaveBalances(filters, {
    enabled: isManager,
  });

  const balances = isManager ? teamBalances ?? [] : allBalances ?? [];

 const total = balances.length;

  return (
    <div>
      <section className="overflow-hidden rounded-lg border border-border bg-white">

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
          <LeaveBalanceTable
            employees={balances}

          />
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          {/* LeaveBalanceCardList */}
        </div>

      </section>
    </div>
  );
};

export default LeaveBalances;