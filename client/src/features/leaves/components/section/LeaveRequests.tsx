import { useState } from "react";
import LeaveRequestFilters from "./LeaveRequestFilters";
import LeavesCardList from "./LeavesCardList";
import LeaveRequestTable from "./LeaveTable";
import { useGetLeaveRequests } from "../../hooks/useGetLeaveRequests";

const LeaveRequests = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [leaveType, setLeaveType] = useState("all");

  const { data: requests } = useGetLeaveRequests()

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
          total={8}
          pending={4}
          approved={3}
          rejected={1}
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