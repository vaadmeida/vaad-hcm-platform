import { useState } from "react";
import EmployeeSalaryFilter from "./EmployeeSalaryFilters";
import EmployeeSalaryStructureToolBar from "./EmployeeSalaryStructureToolBar";
// import EmployeeSalaryTable from "./EmployeeSalaryTable";
import EmployeeSalaryPagination from "./EmployeeSalaryPagination";

import { useGetEmployeesWithSalary } from "../../hooks/useGetEmployeesWithSalary";
import type {
    EmployeeWithSalary,
    SalaryStatus,
} from "../../types/salary.types";

import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import SalaryStructureView from "../SalaryStructureView";
import AddEmployeeSalaryModal from "../add-salary/AddEmployeeSalaryModal";

const EmployeeSalaryStructure = () => {
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState("all");
    const [salaryStatus, setSalaryStatus] = useState<SalaryStatus | "all">("all");
    const [page, setPage] = useState(1);

    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

    const [isAddSalaryOpen, setIsAddSalaryOpen] = useState(false);
    const [addSalaryEmployee, setAddSalaryEmployee] =
        useState<EmployeeWithSalary | undefined>();

    const { data, isLoading, isError } = useGetEmployeesWithSalary({
        page,
        search,
        department,
        salaryStatus,
    });

    const employees = data?.data ?? [];
    const pagination = data?.pagination;
    const total = pagination?.total ?? 0;

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    const handleDepartmentChange = (value: string) => {
        setDepartment(value);
        setPage(1);
    };

    const handleSalaryStatusChange = (value: SalaryStatus | "all") => {
        setSalaryStatus(value);
        setPage(1);
    };

    // const handleAddSalary = (employee: EmployeeWithSalary) => {
    //     setAddSalaryEmployee(employee);
    //     setIsAddSalaryOpen(true);
    // };

    // Show selected employee salary
    if (selectedEmployeeId) {
        return (
            <SalaryStructureView
                employeeId={selectedEmployeeId}
                onBack={() => setSelectedEmployeeId(null)}
            />
        );
    }

    return (
        <div className="space-y-4">
            <EmployeeSalaryStructureToolBar />

            <section className="overflow-hidden rounded-lg lg:border lg:border-border lg:bg-white">
                <EmployeeSalaryFilter
                    search={search}
                    onSearch={handleSearch}
                    department={department}
                    onDepartmentChange={handleDepartmentChange}
                    salaryStatus={salaryStatus}
                    onSalaryStatusChange={handleSalaryStatusChange}
                    total={total}
                />

                {isLoading && (
                    <div className="p-6 text-center text-sm text-muted-foreground">
                        Loading employees...
                    </div>
                )}

                {isError && (
                    <ErrorState
                        title="Failed to load employees"
                        message="Something went wrong while loading salary records. Please try again."
                    />
                )}

                {!isLoading && !isError && (
                    <>
                        {employees.length === 0 ? (
                            <EmptyState
                                title="No employees found"
                                description="There are no employees matching your search or selected filters."
                            />
                        ) : (
                            <div className="hidden md:block">
                                 {/* <EmployeeSalaryTable
                                    employees={employees}
                                    onViewSalary={setSelectedEmployeeId}
                                    onReviewSalary={(employeeId) => {
                                        // Connect existing salary review flow here.
                                    }}
                                    onAddSalary={handleAddSalary}
                                />  */}
                            </div>
                        )}

                        {pagination && (
                            <EmployeeSalaryPagination
                                pagination={pagination}
                                onPageChange={setPage}
                            />
                        )}
                    </>
                )}
            </section>

            <AddEmployeeSalaryModal
                open={isAddSalaryOpen}
                onOpenChange={(open) => {
                    setIsAddSalaryOpen(open);

                    if (!open) {
                        setAddSalaryEmployee(undefined);
                    }
                }}
                employee={addSalaryEmployee}
            />
        </div>
    );
};

export default EmployeeSalaryStructure;
