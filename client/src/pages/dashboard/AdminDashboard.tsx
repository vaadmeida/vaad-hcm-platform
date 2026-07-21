import { formatCurrentDate, getGreeting } from "@/utils/date";
import { useAuthStore } from "@/store/auth.store";
import { useDashboardStats } from "@/features/dashboard/hooks/useDashboardStats";
import PageLoader from "@/components/common/PageLoader";
import ErrorState from "@/components/common/ErrorState";
import DashboardStats from "@/features/dashboard/components/DashboardStats";

const AdminDashboard = () => {

  const user = useAuthStore((state) => state.user);

  const { isLoading, error } = useDashboardStats()

  if (isLoading) {
    return <PageLoader/>
  }

  if (error) {
     <ErrorState/>
  } 

  return (
    <div className="space-y-8">
      {/* Header */}
      <section>
        <h1 className="text-2xl font-bold text-gray-800">
          {getGreeting()}, {user?.first_name} 👋
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Here's your organization at a glance — {formatCurrentDate()}
        </p>
      </section>

      {/* Stats Cards */}
       <DashboardStats/>
    
   
      {/* Charts */}

      {/* Recent Employees */}

      {/* Recent Activities */}
    </div>
  );
};

export default AdminDashboard;