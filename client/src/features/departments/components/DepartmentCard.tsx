import {
    CircleCheck,
    CircleX,
    MoreHorizontal,
    Users,
} from "lucide-react";
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Department } from "../types/departments.types";
import { Link } from "react-router-dom";

interface DepartmentCardProps {
    department: Department;
}

export default function DepartmentCard({
    department,
}: DepartmentCardProps) {
    const managerName = department.manager
        ? `${department.manager.first_name} ${department.manager.last_name}`
        : "No manager assigned";

    const initials = department.manager
        ? `${department.manager.first_name[0]}${department.manager.last_name[0]}`
        : "?";

    const isActive = department.status === "active";

    return (
        <Link to={`/departments/${department.id}`}
           className="group rounded-xl border border-gray-300 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-gray-300 hover:shadow-md"> 
       
            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                    <h3 className="truncate text-base font-semibold text-gray-900">
                        {department.name}
                    </h3>

                    <p className="mt-1 line-clamp-2 min-h-10 text-sm leading-5 text-gray-500">
                        {department.description ||
                            "No department description provided."}
                    </p>
                </div>

                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0 text-gray-400 hover:bg-gray-100 hover:text-gray-700"
                >
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">
                        Department actions
                    </span>
                </Button>
            </div>

            {/* Manager */}
            <div className="mt-5 flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-gray-100">
                    <AvatarImage
                        src={
                            department.manager?.avatar_url ??
                            undefined
                        }
                        alt={managerName}
                    />

                    <AvatarFallback className="bg-[#1078A9]/10 text-sm font-medium text-[#1078A9]">
                        {initials}
                    </AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                    <p className="text-xs font-medium text-gray-400">
                        Department Manager
                    </p>

                    <p className="truncate text-sm font-medium text-gray-800">
                        {managerName}
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div className="mt-5 flex items-center justify-between border-t border-gray-100 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="flex h-7 w-7 items-center justify-center rounded-md bg-gray-50">
                        <Users className="h-3.5 w-3.5 text-gray-500" />
                    </div>

                    <span>
                        {department.employee_count}{" "}
                        {department.employee_count === 1
                            ? "Employee"
                            : "Employees"}
                    </span>
                </div>

                <Badge
                    variant="secondary"
                    className={
                        isActive
                            ? "gap-1 bg-green-50 px-2.5 py-1 text-green-700 hover:bg-green-50"
                            : "gap-1 bg-gray-100 px-2.5 py-1 text-gray-600 hover:bg-gray-100"
                    }
                >
                    {isActive ? (
                        <CircleCheck className="h-3.5 w-3.5" />
                    ) : (
                        <CircleX className="h-3.5 w-3.5" />
                    )}

                    {isActive ? "Active" : "Inactive"}
                </Badge>
            </div>
         </Link>
    );
}