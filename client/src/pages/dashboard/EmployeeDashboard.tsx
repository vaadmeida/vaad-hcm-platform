import EmployeeByDepartmentChart from "@/features/dashboard/components/EmployeeByDepartmentsChart";
import EmployeeDashboardStats from "@/features/dashboard/components/EmployeeDashboardStats";
import { useEmployeesByDepartment } from "@/features/dashboard/hooks/useEmployeesByDepartment";
import { useAuthStore } from "@/store/auth.store";
import { dashboardSubtitle } from "@/utils/dashboardSubtitle";
import { getGreeting } from "@/utils/date"

const EmployeeDashboard = () => {


  const user = useAuthStore((state) => state.user);

  const { data: employeeDepartments } = useEmployeesByDepartment();
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
        <EmployeeDashboardStats />,

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <EmployeeByDepartmentChart
            data={employeeDepartments?.data ?? []}
          />


        </div>

      </div>
    </div>
  )
}

export default EmployeeDashboard
