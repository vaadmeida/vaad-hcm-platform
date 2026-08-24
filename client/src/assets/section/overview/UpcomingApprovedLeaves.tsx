import ErrorState from "@/components/common/ErrorState";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import { useUpcomingLeaves } from "@/features/leaves/hooks/useUpcomingLeaves";


const UpcomingApprovedLeaves = () => {
  const { data, isLoading, error, refetch } = useUpcomingLeaves();

  if (error) {
    return (
      <ErrorState
        message="Unable to load upcoming leaves."
        onRetry={refetch}
      />
    );
  }

  if (isLoading) {
    return <SkeletonLoader />;
  }

  const requests = data?.data ?? [];

  return (
   <div className="w-full rounded-xl border border-gray-200 bg-white">
    {/* Header */}
    <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
        <div>
          <h2 className="text-base font-semibold text-[#121417]">
            Upcoming Leave
          </h2>

          <p className="mt-0.5 text-xs text-muted-foreground">
            Approved — next 30 days
          </p>
        </div>

        <button
          type="button"
          className="text-xs font-medium text-[#1078A9] transition hover:text-[#0d658e]"
        >
          View all
        </button>
      </div>

      {/* Requests */}
      {requests.length === 0 ? (
        <div className="flex flex-1 items-center justify-center px-5 py-10 text-center">
          <div>
            <p className="text-sm font-medium text-[#121417]">
              No upcoming leave
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              There are no approved leaves in the next 30 days.
            </p>
          </div>
        </div>
      ) : (
        <div className="flex-1 divide-y divide-gray-100">
          {requests.map((request) => {
            const employeeName = `${request.employee.first_name} ${request.employee.last_name}`;

            const startDate = new Date(
              request.start_date
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });

            const endDate = new Date(
              request.end_date
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            });

            const initials = `${request.employee.first_name[0] ?? ""}${
              request.employee.last_name[0] ?? ""
            }`.toUpperCase();

            return (
              <div
                key={request.id}
                className="grid grid-cols-[auto_minmax(0,1fr)_minmax(140px,1fr)] items-center gap-4 px-5 py-4 transition hover:bg-gray-50"
              >
                {/* Avatar */}
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1078A9]/10 text-xs font-semibold text-[#1078A9]">
                  {request.employee.avatar_url ? (
                    <img
                      src={request.employee.avatar_url}
                      alt={employeeName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    initials
                  )}
                </div>

                {/* Employee + Leave */}
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#121417]">
                    {employeeName}
                  </p>

                  <p className="mt-0.5 truncate text-xs text-muted-foreground">
                    {request.leaveType.name}
                  </p>
                </div>

                {/* Dates */}
                <div className="min-w-0 text-right">
                  <p className="truncate text-xs font-medium text-[#121417]">
                    {startDate} – {endDate}
                  </p>

                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {request.total_days} days
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UpcomingApprovedLeaves;