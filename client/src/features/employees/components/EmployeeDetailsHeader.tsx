import {
  CalendarDays,
  ChevronDown,
  Mail,
  MapPin,
  Pencil,
  Phone,
} from "lucide-react";
import type { Employee, EmployeeStatus } from "../types/employee.types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import TerminateEmployeeDialog from "./EmployeeDetailsTab/TerminateEmployeeDialog";


interface EmployeeDetailsHeaderProps {
  employee: Employee;
  onEdit: () => void;
}

const statusStyles = {
  active: "border-green-200 bg-green-50 text-green-700",
  probation: "border-blue-200 bg-blue-50 text-blue-700",
  inactive: "border-gray-200 bg-gray-50 text-gray-600",
  terminated: "border-red-200 bg-red-50 text-red-700",
};


const statusOptions = [
  {
    value: "active",
    label: "Active",
    dotClass: "bg-green-500",
  },
  {
    value: "probation",
    label: "Probation",
    dotClass: "bg-blue-500",
  },
  {
    value: "inactive",
    label: "Inactive",
    dotClass: "bg-gray-500",
  },
  {
    value: "terminated",
    label: "Terminated",
    dotClass: "bg-red-500",
  },
];

const EmployeeDetailsHeader = ({
  employee,
  onEdit,
}: EmployeeDetailsHeaderProps) => {


  const [status, setStatus] = useState<EmployeeStatus>(employee.employment.status);
  const [showTerminateDialog, setShowTerminateDialog] = useState(false);
  

  const fullName = employee.full_name;

  const initials = `${employee.personal.first_name?.[0] ?? ""}${employee.personal.last_name?.[0] ?? ""}`.toUpperCase();

  const hireDate = employee.employment.hire_date
    ? new Date(employee.employment.hire_date).toLocaleDateString()
    : "—";

  const handleStatusChange = (value: string) => {
    if (value === "terminated") {
      setShowTerminateDialog(true);
      return;
    }

    setStatus(value as EmployeeStatus);
  };
  return (
    <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Employee Profile */}
        <div className="flex w-full items-start gap-4">
          {/* Avatar */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#1078A9] text-lg font-semibold text-white">
            {initials}
          </div>

          {/* Employee Details */}
          <div className="min-w-0 flex-1">
            <h1 className="text-xl font-semibold leading-tight text-[#121417] md:text-2xl">
              {fullName}
            </h1>

            {/* Job Title + Department */}
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <span className="font-medium text-foreground">
                {employee.employment.job_title || "No position assigned"}
              </span>

              <span className="text-muted-foreground">•</span>

              <span className="text-muted-foreground">
                {employee.employment.department?.name ||
                  "No department assigned"}
              </span>
            </div>

            {/* Employee Information */}
            <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">
              {/* Email */}
              <div className="flex items-start gap-2.5">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#1078A9]" />

                <div className="min-w-0">
                  <p className="text-xs font-medium text-muted-foreground">
                    Email
                  </p>

                  <p className="mt-1 break-all text-sm font-medium text-foreground">
                    {employee.personal.email || "—"}
                  </p>
                </div>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#1078A9]" />

                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Phone
                  </p>

                  <p className="mt-1 text-sm font-medium text-foreground">
                    {employee.personal.phone || "—"}
                  </p>
                </div>
              </div>

              {/* Location */}
              <div className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#1078A9]" />

                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Location
                  </p>

                  <p className="mt-1 text-sm font-medium text-foreground">
                    {employee.personal.state_of_residence || "—"}
                  </p>
                </div>
              </div>

              {/* Joined */}
              <div className="flex items-start gap-2.5">
                <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-[#1078A9]" />

                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Joined
                  </p>

                  <p className="mt-1 text-sm font-medium text-foreground">
                    {hireDate}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status + Edit */}
        <div className="flex w-full shrink-0 items-center gap-3 lg:w-auto lg:pt-1">
          {/* Status */}
          <Select
            value={status}
            onValueChange={handleStatusChange}
          >
            <SelectTrigger
              className={`inline-flex h-8 w-auto min-w-25 shrink-0 justify-center gap-1.5 rounded-full border px-3 text-xs font-medium capitalize whitespace-nowrap ${statusStyles[status as keyof typeof statusStyles]
                }`}
            >
              <SelectValue />
              <ChevronDown className="h-3.5 w-3.5 shrink-0" />
            </SelectTrigger>

            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${option.dotClass}`}
                    />
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {/* Edit */}
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full border border-[#1078A9] bg-white px-3 text-xs font-medium whitespace-nowrap text-[#1078A9] transition hover:bg-[#1078A9]/5"
          >
            <Pencil className="h-3.5 w-3.5 shrink-0" />
            Edit Employee
          </button>
        </div>
      </div>
      <TerminateEmployeeDialog
        open={showTerminateDialog}
        employeeName={employee.full_name}
        onOpenChange={setShowTerminateDialog}
        onConfirm={() => {
          setStatus("terminated");
          setShowTerminateDialog(false);
        }}
      />
    </div>
  );
};

export default EmployeeDetailsHeader;