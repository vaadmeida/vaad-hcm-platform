import { useDepartments } from "../hooks/useDepartments";
import { useEmployee } from "@/features/employees/hooks/useEmployee";
import DepartmentModalForm from "./DepartmentModalForm"
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

const DepartmentToolBar = () => {

    const { data: departments = [] } = useDepartments();
    const { data: employees } = useEmployee({});

    return (
        <div>
            <section className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                        Departments
                    </h1>
                    <div className="mt-2 flex flex-col gap-2 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-3">
                        <p>
                            {departments.length}{" "}
                            {departments.length === 1 ? "department" : "departments"}
                        </p>

                        <span className="hidden sm:inline">•</span>

                        <p>
                            {employees?.data?.length ?? 0}{" "}
                            {(employees?.data?.length ?? 0) === 1 ? "employee" : "employees"}
                        </p>
                    </div>
                    <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                        {/* Search */}
                        <div className="relative min-w-55 flex-1">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                            <Input
                                placeholder="Search departments..."
                                className="h-10 w-full rounded-lg border border-slate-300 bg-slate-100 pl-9 text-sm shadow-none transition-all focus:bg-white focus:ring-2 focus:ring-primary/15"
                            />
                        </div>
                    </div>
                </div>



                {/* department modal form */}
                <div className="flex items-center gap-2">
                    <DepartmentModalForm />
                </div>
            </section>
        </div>
    )
}

export default DepartmentToolBar
