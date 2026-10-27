import { useNavigate } from "react-router-dom";
import type { EmployeeListItem } from "../types/employee.types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import StatusBadge from "@/components/common/StatusBadge";
import EmployeeActions from "./EmployeeActions";


interface EmployeeTableRowProps {
  employee: EmployeeListItem;
}

const EmployeeTableRow = ({
  employee,
}: EmployeeTableRowProps) => {


  const navigate = useNavigate();


  return (
    <tr
      onClick={() => navigate(`/employees/${employee.id}`)}
      className="last:border-none hover:bg-gray-50 cursor-pointer">

      <td className="px-3 py-2">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarImage
              src={employee.avatar_url ?? undefined}
              alt={`${employee.first_name} ${employee.last_name}`}
            />

            <AvatarFallback className="bg-primary/10 text-primary font-medium">
              {`${employee.first_name?.charAt(0) ?? ""}${employee.last_name?.charAt(0) ?? ""}`.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium text-gray-900">
              {employee.first_name} {employee.last_name}
            </p>

            <p className="text-xs text-muted-foreground">
              {employee.job_title}
            </p>
          </div>

        </div>
      </td>
      {/* Departments */}
      <td className="px-3 py-2">
        <div className="flex max-w-70 flex-wrap gap-1.5">
          {employee.departments?.length ? (
            employee.departments.map((department) => (
              <span
                key={department.id}
                className="inline-flex rounded-md border border-gray-200 bg-gray-50 px-2 py-1 text-xs text-gray-700"
              >
                {department.name}
              </span>
            ))
          ) : (
            <span className="text-sm text-gray-400">-</span>
          )}
        </div>
      </td>


      {/* Email */}
      <td className="px-3 py-2 hidden xl:block">
        {employee.email}
      </td>


      {/* Status */}
      <td className="px-3 py-2">
        <StatusBadge status={employee.status} />
      </td>


      {/* Manager */}
      <td className="px-3 py-2 hidden xl:block">
        {employee.manager?.name ?? "-"}
      </td>


      {/* Actions */}
      <td className="px-3 py-2 text-center"
        onClick={(e) => e.stopPropagation()}>
        <EmployeeActions employee={employee} />
      </td>

    </tr>
  );
};

export default EmployeeTableRow;