import { useState } from "react";
import EmployeeFilters from "@/features/employees/components/EmployeeFilters";
import EmployeeTable from "@/features/employees/components/EmployeeTable";
import EmployeeTablePagination from "@/features/employees/components/EmployeeTablePagination";
import EmployeeToolbar from "@/features/employees/components/EmployeeToolbar";
import EmployeeCardList from "@/features/employees/components/EmployeeCardList";
import { useEmployee } from "@/features/employees/hooks/useEmployee";

const PAGE_SIZE = 7;

const EmployeePage = () => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);

  const { data: employees } = useEmployee({
    search,
    status,
    department,
    page,
    limit: PAGE_SIZE,
  });

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

        {/* Mobile */}
        <div className="md:hidden">
          <EmployeeCardList employees={employees?.data ?? []} />
        </div>

        {/* Tablet + Desktop */}
        <div className="hidden md:block">
          <EmployeeTable employees={employees?.data ?? []} />
        </div>

        {employees?.pagination && (
          <EmployeeTablePagination
            pagination={employees.pagination}
            onPageChange={setPage}
          />
        )}
      </section>
    </div>
  );
};

export default EmployeePage;
