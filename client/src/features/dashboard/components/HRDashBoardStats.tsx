import ErrorState from "@/components/common/ErrorState";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import { FileText, UserCheck, UserX, Users } from "lucide-react";
import { useDashboardStats } from "../hooks/useDashboardStats";
import StatsCard from "./StatsCard";

const HRDashBoardStats = () => {
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
        return <SkeletonLoader />;
    }

    const stats = data?.data;

    const cards = [
        {
            title: "Total Employees",
            value: stats?.totalEmployees ?? 0,
            description: "Employees in the organization",
            icon: Users,
            iconColor: "action-icon-blue",
        },
        {
            title: "Active Employees",
            value: stats?.activeEmployees ?? 0,
            description: "Currently active employees",
            icon: UserCheck,
            iconColor: "action-icon-green",
        },
        {
            title: "Inactive Employees",
            value: stats?.inactiveEmployees ?? 0,
            description: "Currently inactive employees",
            icon: UserX,
            iconColor: "action-icon-amber",
        },
        {
            title: "Pending Leave Requests",
            value: stats?.pendingLeaveRequests ?? 0,
            description: "Requests awaiting approval",
            icon: FileText,
            iconColor: "action-icon-purple",
        },
    ];

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cards.map((card) => (
                <StatsCard key={card.title} {...card} />
            ))}
        </div>
    );
};

export default HRDashBoardStats;
