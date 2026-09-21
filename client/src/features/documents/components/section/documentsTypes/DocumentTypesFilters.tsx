import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface DocumentTypesFiltersProps {
    search: string;
    onSearch: (value: string) => void;
    requirement: string;
    onRequirementChange: (value: string) => void;
    status: string;
    onStatusChange: (value: string) => void;
}

const DocumentTypesFilters = ({
    search,
    onSearch,
    requirement,
    onRequirementChange,
    status,
    onStatusChange,
}: DocumentTypesFiltersProps) => {
    return (
        <div className="flex flex-col gap-4 border-b border-border p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                {/* Search */}
                <div className="relative w-full lg:w-72">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                        placeholder="Search document types..."
                        value={search}
                        onChange={(e) => onSearch(e.target.value)}
                        className="h-10 w-full rounded-lg border border-slate-300 bg-slate-100 pl-9 text-sm shadow-none focus:bg-white focus:ring-2 focus:ring-primary/15"
                    />
                </div>

                {/* Filters */}
                <div className="flex w-full gap-3 lg:w-auto">
                    {/* Requirement */}
                    <Select
                        value={requirement}
                        onValueChange={onRequirementChange}
                    >
                        <SelectTrigger className="h-10 w-full border border-slate-200 bg-white lg:w-44">
                            <SelectValue placeholder="All Requirements" />
                        </SelectTrigger>

                        <SelectContent
                            side="bottom"
                            sideOffset={4}
                            align="end"
                            className="border border-gray-200"
                        >
                            <SelectItem value="all">
                                All Requirements
                            </SelectItem>

                            <SelectItem value="required">
                                Required
                            </SelectItem>

                            <SelectItem value="optional">
                                Optional
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    {/* Status */}
                    <Select
                        value={status}
                        onValueChange={onStatusChange}
                    >
                        <SelectTrigger className="h-10 w-full border border-slate-200 bg-white lg:w-36">
                            <SelectValue placeholder="All Status" />
                        </SelectTrigger>

                        <SelectContent
                            side="bottom"
                            sideOffset={4}
                            align="end"
                            className="border border-gray-200"
                        >
                            <SelectItem value="all">
                                All Status
                            </SelectItem>

                            <SelectItem value="active">
                                Active
                            </SelectItem>

                            <SelectItem value="inactive">
                                Inactive
                            </SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};

export default DocumentTypesFilters;