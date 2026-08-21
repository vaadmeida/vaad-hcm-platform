import ErrorState from "@/components/common/ErrorState";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import { CalendarDays, CircleCheck, Clock, FileText } from "lucide-react";
import StatsCard from "@/features/dashboard/components/StatsCard";
import { useLeaveStats } from "@/features/leaves/hooks/useLeaveStats";


const LeaveStats = () => {

    const { isLoading, data, error, refetch } = useLeaveStats();

    if (error) {
        return (
            <ErrorState
                message="Unable to load dashboard statistics."
                onRetry={refetch}
            />
        );
    }

    if (isLoading) {
        return <SkeletonLoader />
    }


    const stats = data?.data;

    const cards = [
        {
            title: "Total Requests",
            value: stats?.totalRequests ?? 0,
            description: "Total leave requests",
            icon: FileText,
            iconColor: "action-icon-blue",
        },
        {
            title: "Pending Requests",
            value: stats?.pendingRequests ?? 0,
            description: "Leave requests awaiting approval",
            icon: Clock,
            iconColor: "action-icon-amber",
        },
        {
            title: "Approved Leaves",
            value: stats?.approvedLeaves ?? 0,
            description: "Approved leave requests",
            icon: CircleCheck,
            iconColor: "action-icon-green",
        },
        {
            title: "Currently On Leave",
            value: stats?.currentlyOnLeave ?? 0,
            description: "Employees currently on leave",
            icon: CalendarDays,
            iconColor: "action-icon-purple",
        },
    ];


    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cards.map((card) => (
                <StatsCard key={card.title} {...card} />
            ))}
        </div>
    )
}

export default LeaveStats
