import { useState } from "react";
import LeaveRequestFilters from "./LeaveRequestFilters";
import LeaveRequestTable from "./LeaveTable";
import { useGetLeaveRequests } from "@/features/leaves/hooks/useGetLeaveRequests";
import LeaveRequestDetails from "./LeaveRequestDetails";
import LeavesCardList from "./LeavesCardList";
import LeaveRequestTablePagination from "./LeaveRequestTablePagination";
import EmptyState from "@/components/common/EmptyState";

const LeaveRequests = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [leaveType, setLeaveType] = useState("all");
  const [page, setPage] = useState(1);

  const { data: requests, isError, isLoading, refetch } = useGetLeaveRequests({
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

        {isLoading ? (
          <div className="flex min-h-40 items-center justify-center px-4" role="status">
            <p className="text-sm text-muted-foreground">Loading leave requests…</p>
          </div>
        ) : isError ? (
          <div className="flex min-h-40 flex-col items-center justify-center gap-3 px-4 text-center">
            <p className="text-sm text-red-600" role="alert">
              Couldn’t load leave requests.
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
            {requests?.data?.length ? (
              <>
                <div className="hidden md:block">
                  <LeaveRequestTable
                    requests={requests.data}
                    onRequestClick={handleRequestClick}
                  />
                </div>

                <div className="md:hidden">
                  <LeavesCardList />
                </div>
              </>
            ) : (
              <div className="flex min-h-40 items-center justify-center px-4 py-6 text-center">
                {search.trim() || status !== "all" || leaveType !== "all" ? (
                  <EmptyState
                    title="No matching leave requests"
                    description="Change your search or filters to find leave requests."
                  />
                ) : (
                  <EmptyState
                    title="No leave requests yet"
                    description="Leave requests will appear here when employees submit them."
                  />
                )}
              </div>
            )}

            {requests?.pagination && (total > 0 || page > 1) && (
              <div className="hidden md:block">
                <LeaveRequestTablePagination
                  pagination={requests.pagination}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}

        <LeaveRequestDetails
          requestId={selectedRequestId}
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
        />
      </section>
    </div>
  );
};

export default LeaveRequests;