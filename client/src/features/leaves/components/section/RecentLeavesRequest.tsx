import ErrorState from "@/components/common/ErrorState";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import { useRecentLeaveRequests } from "../../hooks/useRecentLeaves";
import { Check, X } from "lucide-react";

const RecentLeavesRequest = () => {
    const { data, isLoading, error, refetch } = useRecentLeaveRequests();

    if (error) {
        return (
            <ErrorState
                message="Unable to load recent leave requests."
                onRetry={refetch}
            />
        );
    }

    if (isLoading) {
        return <SkeletonLoader />;
    }

    const requests = data?.data ?? [];

    const getStatusStyles = (status: string) => {
        switch (status.toLowerCase()) {
            case "approved":
                return "bg-green-50 text-green-700";

            case "pending":
                return "bg-amber-50 text-amber-700";

            case "rejected":
                return "bg-red-50 text-red-700";

            default:
                return "bg-gray-100 text-gray-600";
        }
    };

    const getStatusDot = (status: string) => {
        switch (status.toLowerCase()) {
            case "approved":
                return "bg-green-500";

            case "pending":
                return "bg-amber-500";

            case "rejected":
                return "bg-red-500";

            default:
                return "bg-gray-400";
        }
    };

    return (
        <div className="w-full rounded-xl border border-gray-200 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div>
                    <h2 className="text-base font-semibold text-[#121417]">
                        Recent Requests
                    </h2>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                        Latest submissions
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
                <div className="px-5 py-10 text-center">
                    <p className="text-sm font-medium text-[#121417]">
                        No recent requests
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                        No leave requests have been submitted recently.
                    </p>
                </div>
            ) : (
                <div className="divide-y divide-gray-100">
                    {requests.map((request) => {
                        const employeeName = `${request.employee.first_name} ${request.employee.last_name}`;

                        const initials = `${request.employee.first_name[0] ?? ""}${request.employee.last_name[0] ?? ""
                            }`.toUpperCase();

                        return (
                            <div
                                key={request.id}
                                className="flex items-center gap-3 px-5 py-4 transition hover:bg-gray-50"
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
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-[#121417]">
                                        {employeeName}
                                    </p>

                                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                        {request.leaveType.name} · {request.total_days}d
                                    </p>
                                </div>

                                {/* Status */}
                                <div className="flex shrink-0 items-center gap-1.5">
                                    <span
                                        className={`h-2 w-2 rounded-full ${getStatusDot(request.status)}`}
                                    />

                                    <span
                                        className={`text-xs font-medium capitalize ${getStatusStyles(
                                            request.status
                                        )}`}
                                    >
                                        {request.status}
                                    </span>
                                </div>
                                {request.status === "pending" && (
                                    <div className="flex shrink-0 items-center gap-1">
                                        <button
                                            type="button"
                                            title="Approve leave request"
                                            className="flex h-8 w-8 items-center justify-center rounded-full text-green-600 transition hover:bg-green-50"
                                        >
                                            <Check className="h-4 w-4 cursor-pointer" />
                                        </button>

                                        <button
                                            type="button"
                                            title="Reject leave request"
                                            className="flex h-8 w-8 items-center justify-center rounded-full text-red-600 transition hover:bg-red-50"
                                        >
                                            <X className="h-4 w-4 cursor-pointer" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RecentLeavesRequest;