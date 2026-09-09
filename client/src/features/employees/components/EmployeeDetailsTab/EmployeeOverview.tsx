import type { Employee } from "../../types/employee.types";
import AccountDetails from "./section/AccountDetails";
import EmergencyContact from "./section/EmergencyContact";
import EmploymentInformation from "./section/EmploymentInformation";
import PersonalInformation from "./section/PersonalInformation";

interface EmployeeOverviewProps {
  employee: Employee;
}

const EmployeeOverview = ({
  employee,
}: EmployeeOverviewProps) => {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <PersonalInformation employee={employee} />

      <EmploymentInformation employee={employee} />

      <EmergencyContact employee={employee} />

      <AccountDetails employee={employee} />
    </div>
  );
};

export default EmployeeOverview;