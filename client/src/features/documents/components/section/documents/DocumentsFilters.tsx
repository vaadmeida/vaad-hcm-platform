import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DocumentFiltersProps {
  search: string;
  onSearch: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  documentType: string;
  onDocumentTypeChange: (value: string) => void;
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

const DocumentFilters = ({
  search,
  onSearch,
  status,
  onStatusChange,
  documentType,
  onDocumentTypeChange,
  total,
  pending,
  approved,
  rejected,
}: DocumentFiltersProps) => {
  const statusFilters = [
    { value: "all", label: "All", count: total },
    { value: "pending", label: "Pending", count: pending },
    { value: "approved", label: "Approved", count: approved },
    { value: "rejected", label: "Rejected", count: rejected },
  ];

  return (
    <div className="flex flex-col gap-4 border-b border-border p-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        {/* Status filters */}
        <div className="flex items-center gap-1 overflow-x-auto">
          {statusFilters.map((filter) => {
            const isActive = status === filter.value;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => onStatusChange(filter.value)}
                className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition ${
                  isActive
                    ? "bg-[#1078A9]/10 text-[#1078A9]"
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

        {/* Search + Document Type */}
        <div className="flex w-full gap-3 lg:w-auto">
          {/* Search */}
          <div className="relative min-w-55 flex-1 lg:w-64 lg:flex-none">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <Input
              placeholder="Search employee or document..."
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              className="h-10 w-full rounded-lg border border-slate-300 bg-slate-100 pl-9 text-sm shadow-none focus:bg-white focus:ring-2 focus:ring-primary/15"
            />
          </div>

          {/* Document Type */}
          <Select
            value={documentType}
            onValueChange={onDocumentTypeChange}
          >
            <SelectTrigger className="h-10 w-44 border border-slate-200 bg-white">
              <SelectValue placeholder="All Documents" />
            </SelectTrigger>

            <SelectContent
              side="bottom"
              sideOffset={4}
              align="end"
              className="border border-gray-200"
            >
              <SelectItem value="all">All Documents</SelectItem>
              <SelectItem value="medical_certificate">
                Medical Certificate
              </SelectItem>
              <SelectItem value="identification">
                Identification
              </SelectItem>
              <SelectItem value="employment_letter">
                Employment Letter
              </SelectItem>
              <SelectItem value="academic_certificate">
                Academic Certificate
              </SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DocumentFilters;