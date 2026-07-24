import { useState } from "react";

import EmployeeFilters from "@/features/employees/components/EmployeeFilters";
import EmployeeTable from "@/features/employees/components/EmployeeTable";
import EmployeeToolbar from "@/features/employees/components/EmployeeToolbar";
import EmployeeCardList from "@/features/employees/components/EmployeeCardList";
import { useEmployee } from "@/features/employees/hooks/useEmployee";

const EmployeePage = () => {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("all");
  const [status, setStatus] = useState("all");

  const { data: employees } = useEmployee();

  return (
    <div className="space-y-6">
      <EmployeeToolbar />

      <section className="overflow-hidden rounded-lg border border-border bg-white">
        <EmployeeFilters
          search={search}
          onSearch={setSearch}
          department={department}
          onDepartmentChange={setDepartment}
          status={status}
          onStatusChange={setStatus}
          total={employees?.count ?? 0}
        />

        {/* Mobile */}
        <div className="md:hidden">
          <EmployeeCardList
            employees={employees?.data ?? []}
          />
        </div>

        {/* Tablet + Desktop */}
        <div className="hidden md:block">
          <EmployeeTable
            employees={employees?.data ?? []}
          />
        </div>
      </section>
    </div>
  );
};

export default EmployeePage;