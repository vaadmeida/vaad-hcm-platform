import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface PayrollEmployeesFiltersProps {
    search: string;
    onSearch: (value: string) => void;
    department: string;
    onDepartmentChange: (value: string) => void;
    departments: string[];
    total: number;
}

const PayrollDetailsFilters = ({
    search,
    onSearch,
    department,
    onDepartmentChange,
    departments,
    total,
}: PayrollEmployeesFiltersProps) => {
    return (
        <div className="border-b border-border p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                {/* Search + Department */}
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
                            <SelectItem value="all">
                                All Departments
                            </SelectItem>

                            {departments.map((name) => (
                                <SelectItem key={name} value={name}>
                                    {name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Employee Count */}
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

export default PayrollDetailsFilters;