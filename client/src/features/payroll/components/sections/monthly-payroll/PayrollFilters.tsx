import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface PayrollFiltersProps {
    search: string;
    onSearch: (value: string) => void;
    year: string;
    onYearChange: (value: string) => void;
    years: number[];
    month: string;
    onMonthChange: (value: string) => void;
    status: string;
    onStatusChange: (value: string) => void;
    total: number;
}

const PayrollFilters = ({
    search,
    year,
    onSearch,
    onYearChange,
    years,
    month,
    onMonthChange,
    status,
    onStatusChange,
}: PayrollFiltersProps) => {

    const months = [
        { value: "1", label: "January" },
        { value: "2", label: "February" },
        { value: "3", label: "March" },
        { value: "4", label: "April" },
        { value: "5", label: "May" },
        { value: "6", label: "June" },
        { value: "7", label: "July" },
        { value: "8", label: "August" },
        { value: "9", label: "September" },
        { value: "10", label: "October" },
        { value: "11", label: "November" },
        { value: "12", label: "December" },
    ];

    return (
        <div className="border-b border-border p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">

                {/* Search + Filters */}
                <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">

                    {/* Search */}
                    <div className="relative w-full sm:w-64">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                        <Input
                            placeholder="Search payroll..."
                            value={search}
                            onChange={(e) => onSearch(e.target.value)}
                            className="h-10 w-full rounded-lg border border-slate-300 bg-slate-100 pl-9 text-sm shadow-none focus:bg-white focus:ring-2 focus:ring-primary/15"
                        />
                    </div>

                    {/* Year */}
                    <Select value={year} onValueChange={onYearChange}>
                        <SelectTrigger className="h-10 w-full border border-slate-200 bg-white sm:w-32">
                            <SelectValue placeholder="All Years" />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">All Years</SelectItem>

                            {years.map((item) => (
                                <SelectItem key={item} value={String(item)}>
                                    {item}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Month */}
                    <Select value={month} onValueChange={onMonthChange}>
                        <SelectTrigger className="h-10 w-full border border-slate-200 bg-white sm:w-36">
                            <SelectValue placeholder="All Months" />
                        </SelectTrigger>

                        <SelectContent
                            side="bottom"
                            sideOffset={4}
                            align="end"
                            className="border border-gray-200"
                        >
                            <SelectItem value="all">All Months</SelectItem>

                            {months.map((item) => (
                                <SelectItem key={item.value} value={item.value}>
                                    {item.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Status */}
                    <Select value={status} onValueChange={onStatusChange}>
                        <SelectTrigger className="h-10 w-full border border-slate-200 bg-white sm:w-36">
                            <SelectValue placeholder="All Statuses" />
                        </SelectTrigger>

                        <SelectContent
                            side="bottom"
                            sideOffset={4}
                            align="end"
                            className="border border-gray-200"
                        >
                            <SelectItem value="all">All Statuses</SelectItem>
                            <SelectItem value="DRAFT">Draft</SelectItem>
                            <SelectItem value="CALCULATED">Calculated</SelectItem>
                            <SelectItem value="REVIEWED">Reviewed</SelectItem>
                            <SelectItem value="APPROVED">Approved</SelectItem>
                            <SelectItem value="PROCESSED">Processed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};

export default PayrollFilters;