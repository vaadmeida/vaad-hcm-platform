import { Search, Download } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface LeaveBalanceFiltersProps {
    search: string;
    onSearch: (value: string) => void;
    department: string;
    onDepartmentChange: (value: string) => void;
    leaveType: string;
    onLeaveTypeChange: (value: string) => void;
    total: number;
    onExport?: () => void;
}

const LeaveBalanceFilters = ({
    search,
    onSearch,
    department,
    onDepartmentChange,
    leaveType,
    onLeaveTypeChange,
    total,
    onExport,
}: LeaveBalanceFiltersProps) => {
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
                            className="border border-gray-200"
                        >
                            <SelectItem value="all">All Departments</SelectItem>
                            <SelectItem value="engineering">Engineering</SelectItem>
                            <SelectItem value="product">Product</SelectItem>
                            <SelectItem value="design">Design</SelectItem>
                            <SelectItem value="finance">Finance</SelectItem>
                            <SelectItem value="marketing">Marketing</SelectItem>
                            <SelectItem value="hr">HR</SelectItem>
                            <SelectItem value="sales">Sales</SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Leave Type */}
                    <Select
                        value={leaveType}
                        onValueChange={onLeaveTypeChange}
                    >
                        <SelectTrigger className="h-10 w-full border border-slate-200 bg-white sm:w-44">
                            <SelectValue placeholder="All Types" />
                        </SelectTrigger>

                        <SelectContent
                            side="bottom"
                            sideOffset={4}
                            className="border border-gray-200"
                        >
                            <SelectItem value="all">All Types</SelectItem>
                            <SelectItem value="annual">Annual Leave</SelectItem>
                            <SelectItem value="sick">Sick Leave</SelectItem>
                            <SelectItem value="maternity">Maternity Leave</SelectItem>
                            <SelectItem value="paternity">Paternity Leave</SelectItem>
                            <SelectItem value="compassionate">
                                Compassionate Leave
                            </SelectItem>
                            <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                            <SelectItem value="study">Study Leave</SelectItem>
                            <SelectItem value="work-from-home">
                                Work From Home
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Right: Count + Export */}
                <div className="flex items-center gap-3">
                    <span className="whitespace-nowrap text-sm text-muted-foreground">
                        <span className="font-semibold text-gray-900">{total}</span>{" "}
                        employees
                    </span>

                    <button
                        type="button"
                        onClick={onExport}
                        className="inline-flex h-10 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                    >
                        <Download className="h-4 w-4" />
                        Export
                    </button>
                </div>

            </div>
        </div>
    );
};

export default LeaveBalanceFilters;