import {
  CalendarDays,
  ChevronDown,
  Mail,
  MapPin,
  Pencil,
  Phone,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

import type {
  Employee,
  EmployeeStatus,
} from "../types/employee.types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import EmployeeExitDialog, {
  type EmployeeExitStatus,
} from "./EmployeeDetailsTab/EmployeeExitDialog";

import { useDeactivateEmployee } from "../hooks/useDeactivateEmployee";
import { useUpdateEmployee } from "../hooks/useUpdateEmployee";
import { useAuthStore } from "@/store/auth.store";

interface EmployeeDetailsHeaderProps {
  employee: Employee;
  onEdit: () => void;
  isMyProfile?: boolean;
}

const statusStyles: Record<EmployeeStatus, string> = {
  active: "border-green-200 bg-green-50 text-green-700",
  unconfirmed: "border-blue-200 bg-blue-50 text-blue-700",
  inactive: "border-gray-200 bg-gray-50 text-gray-600",
  resigned: "border-orange-200 bg-orange-50 text-orange-700",
  terminated: "border-red-200 bg-red-50 text-red-700",
  dismissed: "border-red-200 bg-red-50 text-red-700",
};

const statusOptions = [
  { value: "active", label: "Active", dotClass: "bg-green-500" },
  { value: "unconfirmed", label: "Unconfirmed", dotClass: "bg-blue-500" },
  { value: "inactive", label: "Inactive", dotClass: "bg-gray-500" },
  { value: "resigned", label: "Resigned", dotClass: "bg-orange-500" },
  { value: "terminated", label: "Terminated", dotClass: "bg-red-500" },
  { value: "dismissed", label: "Dismissed", dotClass: "bg-red-500" },
] satisfies {
  value: EmployeeStatus;
  label: string;
  dotClass: string;
}[];

const exitStatuses: EmployeeExitStatus[] = [
  "resigned",
  "terminated",
  "dismissed",
];

const EmployeeDetailsHeader = ({
  employee,
  onEdit,
  isMyProfile = false,
}: EmployeeDetailsHeaderProps) => {
  const [avatarError, setAvatarError] = useState(false);
  const [status, setStatus] = useState<EmployeeStatus>(
    employee.employment.status
  );
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [exitStatus, setExitStatus] =
    useState<EmployeeExitStatus>("terminated");

  const {
    mutateAsync: updateEmployee,
    isPending: isUpdating,
  } = useUpdateEmployee();

  const {
    mutateAsync: inactive,
    isPending: isDeactivating,
  } = useDeactivateEmployee();

  const user = useAuthStore((state) => state.user);

  const canManageEmployee =
    user?.role === "admin" || user?.role === "hr";

  const fullName = employee.full_name;

  const initials =
    `${employee.personal.first_name?.[0] ?? ""}` +
    `${employee.personal.last_name?.[0] ?? ""}`.toUpperCase();

  const hireDate = employee.employment.hire_date
    ? new Date(employee.employment.hire_date).toLocaleDateString()
    : "—";

  const handleStatusChange = async (value: string) => {
    if (exitStatuses.includes(value as EmployeeExitStatus)) {
      setExitStatus(value as EmployeeExitStatus);
      setShowExitDialog(true);
      return;
    }

    if (
      value !== "active" &&
      value !== "inactive" &&
      value !== "unconfirmed"
    ) {
      return;
    }

    try {
      if (value === "inactive") {
        await inactive(employee.id);
      } else {
        await updateEmployee({
          employeeId: employee.id,
          payload: {
            status: value as EmployeeStatus,
          },
        });
      }

      setStatus(value as EmployeeStatus);

      toast.success(
        `${employee.personal.first_name} ${employee.personal.last_name}'s status updated`
      );
    } catch (error) {
      console.error("Employee status update failed:", error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      toast.error(message || "Failed to update employee status");
    }
  };

  const handleEmployeeExit = async (exitDate: string) => {
    try {
      await updateEmployee({
        employeeId: employee.id,
        payload: {
          status: exitStatus,
          date_exited: exitDate,
        },
      });

      setStatus(exitStatus);
      setShowExitDialog(false);

      const actionLabels: Record<EmployeeExitStatus, string> = {
        resigned: "recorded as resigned",
        terminated: "terminated",
        dismissed: "dismissed",
      };

      toast.success(
        `${employee.full_name} has been ${actionLabels[exitStatus]}`
      );
    } catch (error) {
      console.error("Employee exit status update failed:", error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      toast.error(message || `Failed to update employee status`);
    }
  };

  return (
    <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm md:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        {/* Employee Profile */}
        <div className="flex w-full items-start gap-4">
          {/* Avatar */}
          <div className="h-16 w-16 shrink-0 overflow-hidden rounded-full bg-[#1078A9]">
            {employee.avatar_url && !avatarError ? (
              <img
                src={employee.avatar_url}
                alt={fullName}
                className="h-full w-full object-cover"
                onError={() => setAvatarError(true)}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg font-semibold text-white">
                {initials}
              </div>
            )}
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
                {employee.employment.departments
                  ?.map((department) => department.name)
                  .join(", ") || "No department assigned"}
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

        {/* Status and Edit Actions */}
        <div className="flex w-full shrink-0 items-center gap-3 lg:w-auto lg:pt-1">
          {canManageEmployee ? (
            <Select
              value={status}
              onValueChange={handleStatusChange}
              disabled={isDeactivating || isUpdating}
            >
              <SelectTrigger
                className={`inline-flex h-8 w-auto min-w-25 shrink-0 justify-center gap-1.5 rounded-full border px-3 text-xs font-medium capitalize whitespace-nowrap ${
                  statusStyles[status]
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
          ) : (
            <div
              className={`inline-flex h-8 min-w-25 items-center justify-center rounded-full border px-3 text-xs font-medium capitalize whitespace-nowrap ${
                statusStyles[status]
              }`}
            >
              {status}
            </div>
          )}

          {/* Edit */}
          {isMyProfile ? (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full border border-[#1078A9] bg-white px-3 text-xs font-medium whitespace-nowrap text-[#1078A9] transition hover:bg-[#1078A9]/5"
            >
              <Pencil className="h-3.5 w-3.5 shrink-0" />
              Edit Profile
            </button>
          ) : (
            canManageEmployee && (
              <button
                type="button"
                onClick={onEdit}
                className="inline-flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full border border-[#1078A9] bg-white px-3 text-xs font-medium whitespace-nowrap text-[#1078A9] transition hover:bg-[#1078A9]/5"
              >
                <Pencil className="h-3.5 w-3.5 shrink-0" />
                Edit Employee
              </button>
            )
          )}
        </div>
      </div>

      {/* Employee Exit Dialog */}
      <EmployeeExitDialog
        open={showExitDialog}
        employeeName={fullName}
        status={exitStatus}
        onOpenChange={setShowExitDialog}
        onConfirm={handleEmployeeExit}
        isPending={isUpdating}
      />
    </div>
  );
};

export default EmployeeDetailsHeader;