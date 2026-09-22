import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface EmployeeDocumentsFilterProps {
    search: string;
    onSearch: (value: string) => void;
    status: string;
    onStatusChange: (value: string) => void;
    total: number;
    pending: number;
    approved: number;
    needsAttention: number;
}

const EmployeeDocumentsFilter = ({
    search,
    onSearch,
    status,
    onStatusChange,
    total,
    pending,
    approved,
    needsAttention,
}: EmployeeDocumentsFilterProps) => {
    const statusFilters = [
        { value: "all", label: "All", count: total },
        { value: "pending", label: "Pending", count: pending },
        { value: "approved", label: "Approved", count: approved },
        { value: "needs_attention", label: "Needs Attention", count: needsAttention},
    ];

    return (
        <div className="flex flex-col gap-4 border-b border-border p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-1 overflow-x-auto">
                    {statusFilters.map((filter) => {
                        const isActive = status === filter.value;
                        return (
                            <button
                                key={filter.value}
                                type="button"
                                onClick={() =>
                                    onStatusChange(filter.value)
                                }
                                className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition ${
                                    isActive
                                        ? "bg-primary/10 text-primary"
                                        : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                            >
                                {filter.label}
                                <span className="ml-1 font-semibold">
                                    {filter.count}
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="relative w-full lg:w-64">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        placeholder="Search documents..."
                        value={search}
                        onChange={(e) => onSearch(e.target.value)}
                        className="h-10 w-full rounded-lg border border-slate-300 bg-slate-100 pl-9 text-sm shadow-none focus:bg-white focus:ring-2 focus:ring-primary/15"
                    />
                </div>
            </div>
        </div>
    );
};

export default EmployeeDocumentsFilter;