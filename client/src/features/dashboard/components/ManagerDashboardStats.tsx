import ErrorState from "@/components/common/ErrorState";
import { useDashboardStats } from "../hooks/useDashboardStats";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import { FileText, Users } from "lucide-react";
import StatsCard from "./StatsCard";

const ManagerDashboardStats = () => {

    const { isLoading, data, error, refetch } = useDashboardStats();

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
            title: "Team Members",
            value: stats?.teamMembers ?? 0,
            description: "Employees reporting to you",
            icon: Users,
            iconColor: "action-icon-blue",
        },
        {
            title: "Active Team Members",
            value: stats?.activeTeamMembers ?? 0,
            description: "Currently active staff",
            icon: Users,
            iconColor: "action-icon-green",
        },
        {
            title: "Pending Leave Approvals",
            value: stats?.pendingLeaveApprovals ?? 0,
            description: "Requests awaiting approval",
            icon: FileText,
            iconColor: "action-icon-purple",
        },
        {
            title: "Currently on Leave",
            value: stats?.teamOnLeave ?? 0,
            description: "Team members currently on leave",
            icon: Users,
            iconColor: "action-icon-amber",
        },
    ];

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cards.map((card)=>(
                <StatsCard key={card.title} {...card}/>
            ))}
        </div>
    )
}

export default ManagerDashboardStats
