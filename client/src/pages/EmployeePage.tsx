import { useState } from "react";
import EmployeeFilters from "@/features/employees/components/EmployeeFilters";
import EmployeeTable from "@/features/employees/components/EmployeeTable";
import EmployeeTablePagination from "@/features/employees/components/EmployeeTablePagination";
import EmployeeToolbar from "@/features/employees/components/EmployeeToolbar";
import EmployeeCardList from "@/features/employees/components/EmployeeCardList";
import { useEmployee } from "@/features/employees/hooks/useEmployee";
import EmptyState from "@/components/common/EmptyState";

const PAGE_SIZE = 7;

const EmployeePage = () => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const { data: employees, isError, isLoading, refetch } = useEmployee({
    search,
    status,
    department,
    page,
    limit: PAGE_SIZE,
  });

  const hasActiveFilters =
    search.trim() !== "" || department !== "all" || status !== "all";

  const employeeList = employees?.data ?? [];

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleDepartmentChange = (value: string) => {
    setDepartment(value);
    setPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <EmployeeToolbar />

      <section className="overflow-hidden rounded-lg border border-border bg-white">
        <EmployeeFilters
          search={search}
          onSearch={handleSearchChange}
          department={department}
          onDepartmentChange={handleDepartmentChange}
          status={status}
          onStatusChange={handleStatusChange}
          total={employees?.pagination.total ?? 0}
        />

        {isLoading ? (
          <div className="flex min-h-40 items-center justify-center px-4" role="status">
            <p className="text-sm text-muted-foreground">Loading employees…</p>
          </div>
        ) : isError ? (
          <div className="flex min-h-40 flex-col items-center justify-center gap-3 px-4 text-center">
            <p className="text-sm text-red-600" role="alert">
              Couldn’t load employees.
            </p>

            <button
              type="button"
              onClick={() => void refetch()}
              className="rounded-md border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted"
            >
              Try again
            </button>
          </div>
        ) : (
          <>
            {employeeList.length > 0 ? (
              <>
                <div className="md:hidden">
                  <EmployeeCardList employees={employeeList} />
                </div>

                <div className="hidden md:block">
                  <EmployeeTable employees={employeeList} />
                </div>
              </>
            ) : (
              <div className="flex min-h-40 items-center justify-center px-4 py-6 text-center">
                <EmptyState
                  title={
                    hasActiveFilters ? "No matching employees" : "No employees yet"
                  }
                  description={
                    hasActiveFilters
                      ? "Change your search or filters to find employees."
                      : "Add your first employee to start building your directory."
                  }
                />
              </div>
            )}

            {employees?.pagination &&
              (employees.pagination.total > 0 || page > 1) && (
                <EmployeeTablePagination
                  pagination={employees.pagination}
                  onPageChange={setPage}
                />
              )}
          </>
        )}
      </section>
    </div>
  );
};

export default EmployeePage;
