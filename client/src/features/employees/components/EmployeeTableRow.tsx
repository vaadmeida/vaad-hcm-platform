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

  console.log(employee.avatar_url);
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
      {/* Department */}
      <td className="px-3 py-2">
        {employee.department?.name ?? "-"}
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