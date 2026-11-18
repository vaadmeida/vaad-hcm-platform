import { useEffect, useState } from "react";

import PayrollDetailsStats from "./PayrollDetailsStats";
import PayrollDetailsHeader from "./PayrollDetailsHeader";
import PayrollDetailsFilters from "./PayrollDetailsFilters";
import PayrollEmployeesTable from "./PayrollEmployeesTable";

import { useGetPayrollById } from "@/features/payroll/hooks/useGetPayrollById";

interface PayrollDetailsProps {
    payrollId: string;
    onBack: () => void;
}

const PayrollDetails = ({
    payrollId,
    onBack,
}: PayrollDetailsProps) => {
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [department, setDepartment] = useState("all");
    const [page, setPage] = useState(1);

    const limit = 7;

    useEffect(() => {
        const timeout = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, 400);

        return () => clearTimeout(timeout);
    }, [search]);

    const {
        data,
        isLoading,
        error,
        refetch,
    } = useGetPayrollById(payrollId, {
        search: debouncedSearch || undefined,
        department: department === "all" ? undefined : department,
        page,
        limit,
    });
    const payroll = data?.data.payroll;


  

    const handleDepartmentChange = (value: string) => {
        setDepartment(value);
        setPage(1);
    };

    return (
        <div className="space-y-6">
            <PayrollDetailsHeader onBack={onBack} />

            <PayrollDetailsStats payrollId={payrollId} />

            <section className="overflow-hidden rounded-lg lg:border lg:border-border lg:bg-white">
                {isLoading && !payroll && (
                    <p className="p-6 text-sm text-muted-foreground">
                        Loading payroll employees...
                    </p>
                )}

                {error && !payroll && (
                    <div className="p-6 text-sm text-red-500">
                        Unable to load payroll employees.
                        <button
                            type="button"
                            onClick={() => refetch()}
                            className="ml-2 underline"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {payroll && (
                    <>
                        <PayrollDetailsFilters
                            search={search}
                            onSearch={setSearch}
                            department={department}
                            onDepartmentChange={handleDepartmentChange}
                            departments={payroll.departments}
                            total={payroll.pagination.total}
                        />

                        <PayrollEmployeesTable
                            employees={payroll.employees}
                        />
                    </>
                )}
            </section>
        </div>
    );
};

export default PayrollDetails;