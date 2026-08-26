import { useState } from "react";
import LeaveRequestFilters from "./LeaveRequestFilters";
import LeavesCardList from "./LeavesCardList";
import LeaveRequestTable from "./LeaveTable";
import { useGetLeaveRequests } from "@/features/leaves/hooks/useGetLeaveRequests";
import LeaveRequestDetails from "./LeaveRequestDetails";

const LeaveRequests = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [leaveType, setLeaveType] = useState("all");

  const { data: requests } = useGetLeaveRequests({
    search: search || undefined,
    status: status === "all" ? undefined : status,
    leave_type_id: leaveType === "all" ? undefined : leaveType,
  });

  const total = requests?.data?.length ?? 0;

  const pending =
    requests?.data.filter(
      (request) => request.status === "pending"
    ).length ?? 0;

  const approved =
    requests?.data.filter(
      (request) => request.status === "approved"
    ).length ?? 0;

  const rejected =
    requests?.data.filter(
      (request) => request.status === "rejected"
    ).length ?? 0;

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );

  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleRequestClick = (requestId: string) => {
    setSelectedRequestId(requestId);
    setDetailsOpen(true);
  };

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
            onRequestClick={handleRequestClick}
          />
        </div>

        <LeaveRequestDetails
          requestId={selectedRequestId}
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
        />

        {/* Mobile */}
        <div className="md:hidden">
          <LeavesCardList />
        </div>
      </section>
    </div>
  );
};

export default LeaveRequests;