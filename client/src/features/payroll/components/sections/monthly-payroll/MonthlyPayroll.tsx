import { useState } from "react";
import MonthlyPayrollHeader from "./MonthlyPayrollHeader";
import PayrollFilters from "./PayrollFilters";
import MonthlyPayrollTable from "./MonthlyPayrollTable";
import MonthlyPayrollPagination from "./MonthlyPayrollPagination";

import type { OnViewPayslips, PayrollStatus } from "@/features/payroll/types/payroll.types";
import { useGetPayrolls } from "@/features/payroll/hooks/usePayroll";
import PreparePayrollModal from "./PreparePayrollModal";
import PayrollDetails from "./PayrollDetails/PayrollDetails";
import EmptyState from "@/components/common/EmptyState";

interface MonthlyPayrollProps {
    initialPayrollId?: string | null;
    onViewPayslips: OnViewPayslips;
}


const MonthlyPayroll = ({ initialPayrollId = null, onViewPayslips }: MonthlyPayrollProps) => {
    const [search, setSearch] = useState("");
    const [year, setYear] = useState("all");
    const [month, setMonth] = useState("all");
    const [status, setStatus] = useState("all");
    const [page, setPage] = useState(1);

    const [prepareModalOpen, setIsPrepareModalOpen] = useState(false);

    const [selectedPayrollId, setSelectedPayrollId] = useState<string | null>(initialPayrollId);

    const handleViewPayroll = (payrollId: string) => {
        setSelectedPayrollId(payrollId);
    };

    const limit = 7;

    const { data, isLoading, isError } = useGetPayrolls({
        page,
        limit,
        ...(year !== "all" && { year: Number(year) }),
        ...(month !== "all" && { month: Number(month) }),
        ...(status !== "all" && { status: status as PayrollStatus }),
        ...(search.trim() && { search: search.trim() }),
    });

    const handleFilterChange = (
        setter: (value: string) => void,
        value: string
    ) => {
        setter(value);
        setPage(1);
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };


    if (selectedPayrollId) {
        return (
            <PayrollDetails
                payrollId={selectedPayrollId}
                onBack={() => setSelectedPayrollId(null)}
                 onViewPayslips={onViewPayslips}
            />
        );
    }

    return (
        <div>
            <MonthlyPayrollHeader
                onPreparePayroll={() => setIsPrepareModalOpen(true)}
            />

            <section className="mt-4 overflow-hidden rounded-lg lg:border lg:border-border lg:bg-white">
                <PayrollFilters
                    year={year}
                    search={search}
                    onSearch={handleSearch}
                    onYearChange={(value) => handleFilterChange(setYear, value)}
                    years={data?.years ?? []}
                    month={month}
                    onMonthChange={(value) => handleFilterChange(setMonth, value)}
                    status={status}
                    onStatusChange={(value) => handleFilterChange(setStatus, value)}
                    total={data?.pagination.total ?? 0}
                />

                {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                        <p className="text-sm text-muted-foreground">
                            Loading payroll records...
                        </p>
                    </div>
                ) : isError ? (
                    <div className="flex h-40 items-center justify-center">
                        <p className="text-sm text-red-500">
                            Failed to load payroll records. Please try again.
                        </p>
                    </div>
                ) : data?.payrolls.length ? (
                    <>
                        <MonthlyPayrollTable
                            payrolls={data.payrolls}
                            onPayrollClick={handleViewPayroll}
                        />

                        <MonthlyPayrollPagination
                            pagination={data.pagination}
                            onPageChange={setPage}
                        />
                    </>
                ) : (
                    <div className="flex h-40 items-center justify-center">
                        <EmptyState
                            title="No payroll records yet"
                            description="Prepare payroll for a month to see it here."
                        />
                    </div>
                )}
            </section>


            <PreparePayrollModal
                open={prepareModalOpen}
                onOpenChange={setIsPrepareModalOpen}
            />
        </div>
    );
};

export default MonthlyPayroll;
