import type { EmployeeListItem } from "../types/employee.types";
import EmployeeCard from "./EmployeeCard";

interface EmployeeCardListProps {
  employees: EmployeeListItem[];
}

const EmployeeCardList = ({
  employees,
}: EmployeeCardListProps) => {
  return (
    <div className="space-y-3 p-4">
      {employees.map((employee) => (
        <EmployeeCard
          key={employee.id}
          employee={employee}
        />
      ))}
    </div>
  );
};

export default EmployeeCardList;