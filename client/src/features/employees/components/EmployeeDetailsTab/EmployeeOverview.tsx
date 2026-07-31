import PersonalInformation from "./section/PersonalInformation";
import type { Employee } from "../../types/employee.types";
import EmploymentInformation from "./section/EmploymentInformation";
import EmergencyContact from "./section/EmergencyContact";
import AccountDetails from "./section/AccountDetails";

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