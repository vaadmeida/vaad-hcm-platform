import { Users, Building2, FileText } from "lucide-react";
import { useDashboardStats } from "../hooks/useDashboardStats";
import StatsCard from "./StatsCard";


const DashboardStats = () => {
  const { data, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Something went wrong.</p>;
  }

  const stats = data?.data;

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      <StatsCard
        title="Employees"
        value={stats?.totalEmployees ?? 0}
        icon={Users}
        iconColor="action-icon-blue"
      />

      <StatsCard
        title="Departments"
        value={stats?.totalDepartments ?? 0}
        icon={Building2}
        iconColor="action-icon-green"
      />

      <StatsCard
        title="Documents"
        value={stats?.pendingLeaveRequests ?? 0}
        icon={FileText}
        iconColor="action-icon-purple"
      />
    </div>
  );
};

export default DashboardStats;