import { useState } from "react";
import LeaveRequestFilters from "./LeaveRequestFilters";
import LeaveRequestTable from "./LeaveTable";
import { useGetLeaveRequests } from "@/features/leaves/hooks/useGetLeaveRequests";
import LeaveRequestDetails from "./LeaveRequestDetails";
import LeavesCardList from "./LeavesCardList";
import LeaveRequestTablePagination from "./LeaveRequestTablePagination";

const LeaveRequests = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [leaveType, setLeaveType] = useState("all");
  const [page, setPage] = useState(1);

  const { data: requests } = useGetLeaveRequests({
    search: search || undefined,
    status: status === "all" ? undefined : status,
    leave_type_id: leaveType === "all" ? undefined : leaveType,
    page,
    limit: 7,
  });

  const total = requests?.data?.length ?? 0;

  const pending =
    requests?.data.filter((request) => request.status === "pending").length ?? 0;

  const approved =
    requests?.data.filter((request) => request.status === "approved").length ?? 0;

  const rejected =
    requests?.data.filter((request) => request.status === "rejected").length ?? 0;

  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    null
  );

  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleRequestClick = (requestId: string) => {
    setSelectedRequestId(requestId);
    setDetailsOpen(true);
  };

  const handleFilterChange = <T,>(setter: (value: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
  };

  return (
    <div>
      <section className="overflow-hidden rounded-lg border border-border bg-white">
        <LeaveRequestFilters
          search={search}
          onSearch={handleFilterChange(setSearch)}
          status={status}
          onStatusChange={handleFilterChange(setStatus)}
          leaveType={leaveType}
          onLeaveTypeChange={handleFilterChange(setLeaveType)}
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

          {requests?.pagination && (
            <LeaveRequestTablePagination
              pagination={requests.pagination}
              onPageChange={setPage}
            />
          )}
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