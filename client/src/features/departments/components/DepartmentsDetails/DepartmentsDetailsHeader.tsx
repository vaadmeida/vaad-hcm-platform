import {
    Building2,
    ChevronDown,
    Pencil,
    Users,
} from "lucide-react";

import type { Department } from "../../types/departments.types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";



interface DepartmentsDetailsHeaderProps {
    department: Department;
    onEdit: () => void;
}

const statusStyles = {
    active: "border-green-200 bg-green-50 text-green-700",
    inactive: "border-gray-200 bg-gray-50 text-gray-600",
};

const statusOptions = [
    {
        value: "active",
        label: "Active",
        dotClass: "bg-green-500",
    },
    {
        value: "inactive",
        label: "Inactive",
        dotClass: "bg-gray-500",
    },
];

const DepartmentsDetailsHeader = ({
    department,
    onEdit,
}: DepartmentsDetailsHeaderProps) => {
//    const [status, setStatus] = useState(department.status);

   // const handleStatusChange = async (value: string) => {
     //   const newStatus = value as "active" | "inactive";

 //       setStatus(newStatus);

     //   await updateDepartment({
       //     id: departmentId,
         //   status: newStatus,
       // });
   // };
    
    const initials = department.name
        .split(" ")
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();

    return (
        <div className="rounded-md border border-gray-200 bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

                {/* Department Information */}
                <div className="flex w-full items-start gap-4">

                    {/* Department Avatar */}
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#1078A9] text-lg font-semibold text-white">
                        {initials}
                    </div>

                    {/* Department Details */}
                    <div className="min-w-0 flex-1">

                        <h1 className="text-xl font-semibold leading-tight text-[#121417] md:text-2xl">
                            {department.name}
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                            {department.description || "No department description available."}
                        </p>

                        {/* Department Information */}
                        <div className="mt-5 grid grid-cols-1 gap-x-8 gap-y-4 sm:grid-cols-2">

                            {/* Manager */}
                            <div className="flex items-start gap-2.5">
                                <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-[#1078A9]" />

                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Manager
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-foreground">
                                        {department.manager
                                            ? `${department.manager.first_name} ${department.manager.last_name}`
                                            : "No manager assigned"}
                                    </p>
                                </div>
                            </div>

                            {/* Employee Count */}
                            <div className="flex items-start gap-2.5">
                                <Users className="mt-0.5 h-4 w-4 shrink-0 text-[#1078A9]" />

                                <div>
                                    <p className="text-xs font-medium text-muted-foreground">
                                        Employees
                                    </p>

                                    <p className="mt-1 text-sm font-medium text-foreground">
                                        {department.employee_count ?? 0}{" "}
                                        {department.employee_count === 1
                                            ? "employee"
                                            : "employees"}
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
                    //  onValueChange={handleStatusChange}
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
                                <SelectItem
                                    key={option.value}
                                    value={option.value}
                                >
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
                        Edit Department
                    </button>
                </div>

            </div>
        </div>
    );
};

export default DepartmentsDetailsHeader;