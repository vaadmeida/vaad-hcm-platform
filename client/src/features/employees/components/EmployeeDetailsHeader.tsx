import { Pencil } from "lucide-react";

interface EmployeeDetailsHeaderProps {
  employee: {
    first_name: string;
    last_name: string;
    job_title?: string | null;
    employee_code?: string;
  };
   onEdit: () => void;
}

const EmployeeDetailsHeader = ({
  employee,
  onEdit,
}: EmployeeDetailsHeaderProps) => {
  const fullName = `${employee.first_name} ${employee.last_name}`;

  const initials = `${employee.first_name?.[0] ?? ""}${
    employee.last_name?.[0] ?? ""
  }`.toUpperCase();

  return (
    <div className="rounded-xl border bg-white p-6">
      <div className="flex items-center justify-between">
        {/* Employee information */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#1078A9] text-lg font-semibold text-white">
            {initials}
          </div>

          {/* Name + details */}
          <div>
            <h1 className="text-xl font-semibold text-[#121417]">
              {fullName}
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              {employee.job_title || "No position assigned"}
            </p>

            <p className="mt-1 text-xs font-medium text-gray-400">
              {employee.employee_code}
            </p>
          </div>
        </div>

        {/* Edit button */}
        <button
          type="button"
          onClick={onEdit}
          className="inline-flex items-center gap-2 rounded-lg bg-[#1078A9] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
        >
          <Pencil className="h-4 w-4" />
          Edit Employee
        </button>
      </div>
    </div>
  );
};

export default EmployeeDetailsHeader;