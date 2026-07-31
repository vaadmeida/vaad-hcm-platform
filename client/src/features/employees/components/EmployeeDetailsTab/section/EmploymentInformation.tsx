import type { Employee } from "@/features/employees/types/employee.types";
import {
  BriefcaseBusiness,
  CalendarDays,
  UserRound,
} from "lucide-react";

import InfoItem from "./InfoItem";

interface EmploymentInformationProps {
  employee: Employee;
}

const EmploymentInformation = ({
  employee,
}: EmploymentInformationProps) => {
  const { employment } = employee;

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <section className="rounded-md border border-gray-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex items-center gap-2">
        <BriefcaseBusiness className="h-4 w-4 shrink-0 text-[#1078A9]" />

        <h2 className="text-sm font-semibold text-[#121417]">
          Employment Information
        </h2>
      </div>

      {/* Information */}
      <div className="grid grid-cols-1 gap-x-6 gap-y-5 sm:grid-cols-2">
        <InfoItem
          label="Employee ID"
          value={employee.employee_code}
        />

        <InfoItem
          label="Job Title"
          value={employment.job_title}
        />

        <InfoItem
          label="Role"
          value={employment.role}
        />

        <InfoItem
          label="Employment Type"
          value={employment.employment_type}
        />

        <InfoItem
          label="Hire Date"
          value={formatDate(employment.hire_date)}
          icon={<CalendarDays className="h-3.5 w-3.5" />}
        />

        <InfoItem
          label="Probation End Date"
          value={formatDate(employment.probation_end_date)}
        />

        <InfoItem
          label="Department"
          value={employment.department?.name}
        />

        <InfoItem
          label="Manager"
          value={employment.manager?.name}
          icon={<UserRound className="h-3.5 w-3.5" />}
        />

        <InfoItem
          label="Work Email"
          value={employment.work_email}
        />

        <InfoItem
          label="Personal Computer"
          value={
            employment.owns_personal_computer
              ? "Yes"
              : "No"
          }
        />

        {/* Full width */}
        <div className="sm:col-span-2">
          <InfoItem
            label="Job Description"
            value={employment.job_description}
          />
        </div>
      </div>
    </section>
  );
};

export default EmploymentInformation;