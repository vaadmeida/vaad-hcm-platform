import ErrorState from "@/components/common/ErrorState";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import {
    CircleCheck,
    CircleX,
    FileClock,
    Files,
} from "lucide-react";
import { useDashboardStats } from "../hooks/useDashboardStats";
import StatsCard from "./StatsCard";

const EmployeeDashboardStats = () => {
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
            title: "Pending Leave Requests",
            value: stats?.pendingLeaveRequests ?? 0,
            description: "Requests awaiting approval",
            icon: FileClock,
            iconColor: "action-icon-blue",
        },
        {
            title: "Approved Leave Requests",
            value: stats?.approvedLeaveRequests ?? 0,
            description: "Your approved leave requests",
            icon: CircleCheck,
            iconColor: "action-icon-green",
        },
        {
            title: "Rejected Leave Requests",
            value: stats?.rejectedLeaveRequests ?? 0,
            description: "Your rejected leave requests",
            icon: CircleX,
            iconColor: "action-icon-amber",
        },
        {
            title: "Total Leave Types",
            value: stats?.totalLeaveTypes ?? 0,
            description: "Available leave types",
            icon: Files,
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

export default EmployeeDashboardStats;