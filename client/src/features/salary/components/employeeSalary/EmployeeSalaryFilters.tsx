import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useDepartments } from "@/features/departments/hooks/useDepartments";
import type { SalaryStatus } from "../../types/salary.types";


interface EmployeeSalaryFilterProps {
    search: string;
    onSearch: (value: string) => void;
    department: string;
    onDepartmentChange: (value: string) => void;
    salaryStatus: SalaryStatus | "all";
    onSalaryStatusChange: (value: SalaryStatus | "all") => void;
    total: number;
}

const EmployeeSalaryFilter = ({
    search,
    onSearch,
    department,
    onDepartmentChange,
    salaryStatus,
    onSalaryStatusChange,
    total,
}: EmployeeSalaryFilterProps) => {

    const { data: departments } = useDepartments();

    return (
        <div className="border-b border-border p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                {/* Left: Search + Filters */}
                <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            placeholder="Search employee..."
                            value={search}
                            onChange={(e) => onSearch(e.target.value)}
                            className="h-10 w-full rounded-lg border border-slate-300 bg-slate-100 pl-9 text-sm shadow-none focus:bg-white focus:ring-2 focus:ring-primary/15"
                        />
                    </div>

                    {/* Department */}
                    <Select
                        value={department}
                        onValueChange={onDepartmentChange}
                    >
                        <SelectTrigger className="h-10 w-full border border-slate-200 bg-white sm:w-44">
                            <SelectValue placeholder="All Departments" />
                        </SelectTrigger>

                        <SelectContent
                            side="bottom"
                            sideOffset={4}
                            align="end"
                            className="border border-gray-200"
                        >
                            <SelectItem value="all">All Departments</SelectItem>

                            {(departments ?? []).map((department) => (
                                <SelectItem
                                    key={department.id}
                                    value={department.id}
                                >
                                    {department.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Salary Status */}
                    <Select
                        value={salaryStatus}
                        onValueChange={onSalaryStatusChange}
                    >
                        <SelectTrigger className="h-10 w-full border border-slate-200 bg-white sm:w-44">
                            <SelectValue placeholder="All Salary Status" />
                        </SelectTrigger>

                        <SelectContent
                            side="bottom"
                            sideOffset={4}
                            align="end"
                            className="border border-gray-200"
                        >
                            <SelectItem value="all">All Salary Status</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="ENDED">Ended</SelectItem>
                            <SelectItem value="NOT_CONFIGURED">
                                Not Configured
                            </SelectItem>
                        </SelectContent>
                    </Select>

                </div>

                {/* Right: Count + Export */}
                <div className="flex items-center gap-3">
                    <span className="whitespace-nowrap text-sm text-muted-foreground">
                        <span className="font-semibold text-gray-900">
                            {total}
                        </span>{" "}
                        employees
                    </span>
                </div>

            </div>
        </div>
    );
};

export default EmployeeSalaryFilter;
