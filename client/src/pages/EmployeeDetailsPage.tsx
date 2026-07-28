import EmployeeDetailsHeader from "@/features/employees/components/EmployeeDetailsHeader";
import { useEmployeeDetails } from "@/features/employees/hooks/useEmployeeDetails";
import { useParams } from "react-router-dom";

const EmployeeDetailsPage = () => {
  const { employeeId } = useParams();

  const { data: employee, isLoading , error} = useEmployeeDetails(employeeId)

  console.log("employeeId:", employeeId);
  console.log("employee:", employee);
  console.log("error:", error);
  console.log(employee);


  const handleEdit = () => {
    // open Edit Employee modal
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!employee) {
    return <div>Employee not found.</div>;
  }

  return (
    <div className="space-y-6">
      <EmployeeDetailsHeader
        employee={employee}
        onEdit={handleEdit}
      />

      {/* Overview / Documents / Activity */}
    </div>
  );
};

export default EmployeeDetailsPage;