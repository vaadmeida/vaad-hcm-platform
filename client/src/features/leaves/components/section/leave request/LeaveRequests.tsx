import { useState } from "react";
import LeaveRequestFilters from "./LeaveRequestFilters";
import LeavesCardList from "./LeavesCardList";
import LeaveRequestTable from "./LeaveTable";
import { useGetLeaveRequests } from "@/features/leaves/hooks/useGetLeaveRequests";


const LeaveRequests = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [leaveType, setLeaveType] = useState("all");

  const { data: requests } = useGetLeaveRequests({
    search: search || undefined,
    status: status === "all" ? undefined : status || undefined,
    leave_type_id: leaveType === "all" ? undefined : leaveType || undefined,
  });

  const total = requests?.data?.length ?? 0;
  const pending = requests?.data.filter((request) => request.status === "pending").length ?? 0;
  const approved = requests?.data.filter((request) => request.status === "approved").length ?? 0;
  const rejected = requests?.data.filter((request) => request.status === "rejected").length ?? 0;


  return (
    
    <div>
      <section className="overflow-hidden rounded-lg border border-border bg-white">



        <LeaveRequestFilters
          search={search}
          onSearch={setSearch}
          status={status}
          onStatusChange={setStatus}
          leaveType={leaveType}
          onLeaveTypeChange={setLeaveType}
          total={total}
          pending={pending}
          approved={approved}
          rejected={rejected}
        />

        {/* Tablet + Desktop */}
        <div className="hidden md:block">
          <LeaveRequestTable
            requests={requests?.data ?? []}
          />

        </div>


        {/* Mobile */}
        <div className="md:hidden">
          <LeavesCardList />
        </div>


      </section>
    </div>
  );
};

export default LeaveRequests;