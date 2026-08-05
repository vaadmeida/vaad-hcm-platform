import type { Department } from "../types/departments.types";
import DepartmentCard from "./DepartmentCard";

interface DepartmentListProps {
  departments: Department[];
}

export default function DepartmentList({
    departments,
}: DepartmentListProps) {
    if (!departments.length) {
        return (
            <div className="rounded-xl border-2 border-gray-100 bg-white py-12 text-center mt-5">
                <p className="text-sm text-gray-500">
                    No departments found.
                </p>
            </div>
        );
    }

    return (
        <div className="my-5 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {departments.map((department) => (
                <DepartmentCard
                    key={department.id}
                    department={department}
                />
            ))}
        </div>
    );
}