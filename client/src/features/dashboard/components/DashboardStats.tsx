import { Users, Building2, FileText } from "lucide-react";
import { useDashboardStats } from "../hooks/useDashboardStats";
import StatsCard from "./StatsCard";
import ErrorState from "@/components/common/ErrorState";
import SkeletonLoader from "@/components/common/SkeletonLoader";

const DashboardStats = () => {
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

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      <StatsCard
        title="Employees"
        value={stats?.totalEmployees ?? 0}
        description="Total registered employees"
        icon={Users}
        iconColor="action-icon-blue"
      />

      <StatsCard
        title="Departments"
        value={stats?.totalDepartments ?? 0}
        description="Company departments"
        icon={Building2}
        iconColor="action-icon-amber"
      />

      <StatsCard
        title="Active Employees"
        value={stats?.activeEmployees ?? 0}
        description="Currently active staff"
        icon={Users}
        iconColor="action-icon-green"
      />

      <StatsCard
        title="Pending Leaves"
        value={stats?.pendingLeaveRequests ?? 0}
        description="Leave requests awaiting approval"
        icon={FileText}
        iconColor="action-icon-purple"
      />
    </div>
  );
};

export default DashboardStats;