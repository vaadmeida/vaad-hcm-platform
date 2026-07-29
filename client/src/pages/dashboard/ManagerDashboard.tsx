import EmployeeByDepartmentChart from "@/features/dashboard/components/EmployeeByDepartmentsChart";
import LeaveOverviewChart from "@/features/dashboard/components/LeaveOverviewChart";
import ManagerDashboardStats from "@/features/dashboard/components/ManagerDashboardStats";
import { useEmployeesByDepartment } from "@/features/dashboard/hooks/useEmployeesByDepartment";
import { useLeaveOverview } from "@/features/dashboard/hooks/useLeaveOverview";
import { useAuthStore } from "@/store/auth.store";
import { dashboardSubtitle } from "@/utils/dashboardSubtitle";
import { getGreeting } from "@/utils/date";

const ManagerDashboard = () => {


  const user = useAuthStore((state) => state.user);
  const { data: employeeDepartments } = useEmployeesByDepartment();
  const { data: leaveOverview } = useLeaveOverview();


  return (
    <div>
      <div className="space-y-8">
        {/* Header */}
        <section>
          <h1 className="text-2xl font-bold text-gray-800">
            {getGreeting()}, {user?.first_name} 👋
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            {dashboardSubtitle[user?.role ?? "employee"]}
          </p>
        </section>

        {/* Stats Cards */}
        <ManagerDashboardStats />

        {/* Charts */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <EmployeeByDepartmentChart
            data={employeeDepartments?.data ?? []}
          />

          <LeaveOverviewChart
            data={leaveOverview?.data ?? []}
          />
        </div>

      </div>
    </div>
  )
}

export default ManagerDashboard
