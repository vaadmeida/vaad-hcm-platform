import type { Employee } from "../types/employee.types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

interface EmployeeCardProps {
  employee: Employee;
}

const EmployeeCard = ({
  employee,
}: EmployeeCardProps) => {
  return (
    <div className="rounded-lg border border-border bg-white p-4 shadow-sm">

      {/* Header */}
      <div className="flex items-center gap-3">

        <Avatar className="h-12 w-12">
          <AvatarImage
            src={employee.avatar_url ?? ""}
            alt={`${employee.first_name} ${employee.last_name}`}
          />

          <AvatarFallback>
            {employee.first_name.charAt(0)}
            {employee.last_name.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-foreground">
            {employee.first_name} {employee.last_name}
          </h3>

          <p className="truncate text-xs text-muted-foreground">
            {employee.job_title}
          </p>
        </div>

      </div>

      {/* Details */}
      <div className="mt-4 space-y-2 text-sm">

        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Department
          </span>

          <span className="font-medium text-right">
            {employee.department?.name ?? "-"}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Status
          </span>

          <span className="font-medium capitalize">
            {employee.status}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Email
          </span>

          <span className="max-w-[180px] truncate text-right">
            {employee.email}
          </span>
        </div>

        <div className="flex justify-between">
          <span className="text-muted-foreground">
            Manager
          </span>

          <span className="text-right">
            {employee.manager?.name ?? "-"}
          </span>
        </div>

      </div>

    </div>
  );
};

export default EmployeeCard;