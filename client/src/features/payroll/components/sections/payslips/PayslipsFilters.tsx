import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface PayslipsFiltersProps {
    year: number | null;
    onYearChange: (year: number) => void;
    years: number[];
    month: number | null;
    onMonthChange: (month: number) => void;
    months: number[];
    search: string;
    onSearch: (value: string) => void;
    total?: number;
}

const monthFormatter = new Intl.DateTimeFormat("en-NG", {
    month: "long",
    timeZone: "UTC",
});

const PayslipsFilters = ({
    year,
    onYearChange,
    years,
    month,
    onMonthChange,
    months,
    search,
    onSearch,
    total,
}: PayslipsFiltersProps) => {
    return (
        <div className="border-b border-gray-200/70 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex w-full flex-col gap-3 sm:flex-row lg:w-auto">
                    <Select
                        value={year === null ? "" : String(year)}
                        onValueChange={(value) => onYearChange(Number(value))}
                        disabled={years.length === 0}
                    >
                        <SelectTrigger
                            aria-label="Payroll year"
                            className="h-10 w-full border-gray-200/70 bg-white shadow-none sm:w-28"
                        >
                            <SelectValue placeholder="Year" />
                        </SelectTrigger>

                        <SelectContent align="start" className="border-gray-200/70">
                            {years.map((option) => (
                                <SelectItem key={option} value={String(option)}>
                                    {option}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={month === null ? "" : String(month)}
                        onValueChange={(value) => onMonthChange(Number(value))}
                        disabled={year === null || months.length === 0}
                    >
                        <SelectTrigger
                            aria-label="Payroll month"
                            className="h-10 w-full border-gray-200/70 bg-white shadow-none sm:w-40"
                        >
                            <SelectValue placeholder="Month" />
                        </SelectTrigger>

                        <SelectContent align="start" className="border-gray-200/70">
                            {months.map((option) => (
                                <SelectItem key={option} value={String(option)}>
                                    {monthFormatter.format(
                                        new Date(Date.UTC(2000, option - 1, 1))
                                    )}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="relative w-full sm:w-64">
                        <Search
                            aria-hidden="true"
                            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                            type="search"
                            aria-label="Search payslips by employee name or ID"
                            placeholder="Search by name or employee ID"
                            value={search}
                            onChange={(event) => onSearch(event.target.value)}
                            disabled={year === null || month === null}
                            className="h-10 w-full rounded-lg border-gray-200/70 bg-slate-50 pl-9 text-sm shadow-none focus:bg-white"
                        />
                    </div>
                </div>

                {total !== undefined && (
                    <p className="whitespace-nowrap text-sm text-muted-foreground">
                        <span className="font-semibold tabular-nums text-foreground">
                            {total}
                        </span>{" "}
                        {total === 1 ? "payslip" : "payslips"}
                    </p>
                )}
            </div>
        </div>
    );
};

export default PayslipsFilters;