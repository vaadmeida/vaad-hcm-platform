import SkeletonLoader from "@/components/common/SkeletonLoader";
import EmployeeEditModal from "@/features/employees/components/EditEmployeeModal/EditEmployeeModal";
import EmployeeDetailsHeader from "@/features/employees/components/EmployeeDetailsHeader";
import type { EmployeeDetailsTab } from "@/features/employees/components/EmployeeDetailsTab/EmployeeDetailsTabs";
import EmployeeDetailsTabs from "@/features/employees/components/EmployeeDetailsTab/EmployeeDetailsTabs";
import EmployeeDocuments from "@/features/employees/components/EmployeeDetailsTab/EmployeeDocuments";
import EmployeeOnboardingMaterials from "@/features/employees/components/EmployeeDetailsTab/EmployeeOnboardingMaterials";
import EmployeeOverview from "@/features/employees/components/EmployeeDetailsTab/EmployeeOverview";
import EmployeeSalaryStructure from "@/features/employees/components/EmployeeDetailsTab/EmployeeSalaryStructure";
import { useEmployeeDetails } from "@/features/employees/hooks/useEmployeeDetails";
import { useAuthStore } from "@/store/auth.store";
import { useState } from "react";
import { useParams } from "react-router-dom";

const EmployeeDetailsPage = () => {
  const { employeeId } = useParams();

  const { data: employee, isLoading } = useEmployeeDetails(employeeId);

  const [activeTab, setActiveTab] =
    useState<EmployeeDetailsTab>("overview");

  const [open, setOpen] = useState(false);

  const user = useAuthStore((state) => state.user);

  const canViewAllTabs =
    user?.role === "admin" || user?.role === "hr";

  if (isLoading) {
    return <SkeletonLoader />;
  }

  if (!employee) {
    return <div>Employee not found.</div>;
  }

  return (
    <div className="space-y-6">
      <EmployeeDetailsHeader
        employee={employee}
        onEdit={() => setOpen(true)}
      />

      {/* Only Admin and HR can see all tabs */}
      {canViewAllTabs && (
        <EmployeeDetailsTabs
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      )}

      {/* Everyone can see Overview */}
      {activeTab === "overview" && (
        <EmployeeOverview employee={employee} />
      )}

      {/* Admin and HR only */}
      {canViewAllTabs && activeTab === "documents" && (
        <EmployeeDocuments employee={employee} />
      )}

      {canViewAllTabs && activeTab === "salary" && (
        <EmployeeSalaryStructure employee={employee} />
      )}

      {canViewAllTabs && activeTab === "onboarding" && (
        <EmployeeOnboardingMaterials />
      )}

      {open && (
        <EmployeeEditModal
          key={employee.id}
          employee={employee}
          open={open}
          onOpenChange={setOpen}
        />
      )}
    </div>
  );
};

export default EmployeeDetailsPage;