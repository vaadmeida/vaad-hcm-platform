import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface EmployeeFiltersProps {
  search: string;
  onSearch: (value: string) => void;
  department: string;
  onDepartmentChange: (value: string) => void;
  status: string;
  onStatusChange: (value: string) => void;
  total: number;
}

const statusWidths = {
  all: "w-[155px]",
  active: "w-[90px]",
  probation: "w-[120px]",
  inactive: "w-[115px]",
  terminated: "w-[125px]",
} as const;

const EmployeeFilters = ({
  search,
  onSearch,
  department,
  onDepartmentChange,
  status,
  onStatusChange,
  total,
}: EmployeeFiltersProps) => {



  return (
    <div className="flex flex-col gap-4 border-b border-border p-4 xl:flex-row xl:items-center xl:justify-between">

      <div className="flex flex-1 flex-wrap gap-3">

        {/* Search */}
        <div className="relative min-w-55 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            placeholder="Search name, email, or ID..."
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            className="h-10 w-full rounded-lg border border-slate-300 bg-slate-100 pl-9 text-sm shadow-none transition-all focus:bg-white focus:ring-2 focus:ring-primary/15"
          />
        </div>

        {/* Department */}
        <Select
          value={department}
          onValueChange={onDepartmentChange}

        >
          <SelectTrigger className="h-10 w-full sm:w-52 border border-slate-200 bg-white">
            <SelectValue placeholder="All Departments" />
          </SelectTrigger>

          <SelectContent
            side="bottom"
            sideOffset={4}
            align="start"
            className="border border-gray-200"
          >
            <SelectItem value="all">
              All Departments
            </SelectItem>

            <SelectItem value="technology">
              Technology
            </SelectItem>

            <SelectItem value="hr">
              Human Resources
            </SelectItem>

            <SelectItem value="research">
              Research & Innovation
            </SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={status}
          onValueChange={onStatusChange}
        >
          <SelectTrigger
            className={`h-8 ${statusWidths[status as keyof typeof statusWidths]} border border-slate-200 bg-white`}
          >
            <SelectValue placeholder="Current Employees" />
          </SelectTrigger>

          <SelectContent
            side="bottom"
            sideOffset={4}
            align="center"
            className="border border-gray-200"
          >
            <SelectItem value="all">Current Employees</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="probation">Probation</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
            <SelectItem value="terminated">Terminated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <p className="shrink-0 text-sm text-muted-foreground">
        {total} results
      </p>

    </div>
  );
};

export default EmployeeFilters;