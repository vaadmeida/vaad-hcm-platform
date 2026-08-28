import SkeletonLoader from "@/components/common/SkeletonLoader";
import EmployeeEditModal from "@/features/employees/components/EditEmployeeModal/EditEmployeeModal";
import EmployeeDetailsHeader from "@/features/employees/components/EmployeeDetailsHeader";
import type { EmployeeDetailsTab } from "@/features/employees/components/EmployeeDetailsTab/EmployeeDetailsTabs";
import EmployeeDetailsTabs from "@/features/employees/components/EmployeeDetailsTab/EmployeeDetailsTabs";
import EmployeeOverview from "@/features/employees/components/EmployeeDetailsTab/EmployeeOverview";
import { useEmployeeDetails } from "@/features/employees/hooks/useEmployeeDetails";
import { useState } from "react";
import { useParams } from "react-router-dom";

const EmployeeDetailsPage = () => {
  const { employeeId } = useParams();

  const { data: employee, isLoading } = useEmployeeDetails(employeeId);

  const [activeTab, setActiveTab] = useState<EmployeeDetailsTab>("overview");

  const [open, setOpen] = useState(false);

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

      <EmployeeDetailsTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === "overview" && (
        <EmployeeOverview employee={employee} />
      )}

      {/*
      {activeTab === "documents" && (
        <EmployeeDocuments employee={employee} />
      )}

      {activeTab === "salary" && (
        <EmployeeSalaryStructure employee={employee} />
      )}
      */}

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