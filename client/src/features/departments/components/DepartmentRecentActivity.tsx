import { useTeamRecentActivities } from "../hooks/useRecentActivity";


interface DepartmentRecentActivityProps {
  departmentId: string;
}

const formatRelativeTime = (date: string) => {

  const diff = Date.now() - new Date(date).getTime();

  const minutes = Math.floor(diff / (1000 * 60));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  if (hours < 24) return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  if (days < 7) return `${days} ${days === 1 ? "day" : "days"} ago`;

  return new Date(date).toLocaleDateString();
};

const DepartmentRecentActivity = ({
  departmentId,
}: DepartmentRecentActivityProps) => {
  const { data, isLoading, error } = useTeamRecentActivities(departmentId);

  if (isLoading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <div className="h-5 w-32 animate-pulse rounded bg-gray-200" />

        <div className="mt-6 space-y-6">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="flex gap-3">
              <div className="h-2 w-2 shrink-0 rounded-full bg-gray-200 mt-2" />

              <div className="flex-1 space-y-2">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
                <div className="h-3 w-20 animate-pulse rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <h2 className="text-base font-semibold text-[#121417]">
          Recent Activity
        </h2>

        <p className="mt-5 text-sm text-red-600">
          Failed to load recent activity.
        </p>
      </div>
    );
  }

  const activities = data ?? [];

  return (
    <div className="rounded-xl border border-gray-200 bg-white">
      {/* Header */}
      <div className="border-b border-gray-100 px-5 py-4">
        <h2 className="text-base font-semibold text-[#121417]">
          Recent Activity
        </h2>

        <p className="mt-0.5 text-xs text-muted-foreground">
          Latest activity in this department
        </p>
      </div>

      {/* Activities */}
      <div className="px-5">
        {activities.length === 0 ? (
          <div className="py-10 text-center">
            <p className="text-sm font-medium text-[#121417]">
              No recent activity
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Activity from this department will appear here.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="flex gap-3 py-4"
              >
                {/* Activity indicator */}
                <div className="flex shrink-0 flex-col items-center">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-[#1078A9]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <p className="truncate text-sm text-[#121417]">
                      {activity.description}
                    </p>

                    <p className="shrink-0 text-xs text-muted-foreground">
                      {formatRelativeTime(activity.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DepartmentRecentActivity;