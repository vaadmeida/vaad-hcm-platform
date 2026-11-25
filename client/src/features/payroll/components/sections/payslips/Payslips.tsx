import { useState } from "react";
import EmptyState from "@/components/common/EmptyState";
import { useGetPayrolls } from "@/features/payroll/hooks/usePayroll";
import { useGetPayrollPayslips } from "@/features/payslips/hooks/useGetPayrollPayslips";

import PayslipsFilters from "./PayslipsFilters";
import PayslipsTable from "./PayslipsTable";
import PayslipsPagination from "./PayslipsPagination";

type PayslipsProps = {
    initialYear?: number | null;
    initialMonth?: number | null;
};


const Payslips = ({ initialYear = null,
    initialMonth = null }: PayslipsProps) => {
    const [selectedYear, setSelectedYear] = useState<number | null>(initialYear);
    const [selectedMonth, setSelectedMonth] = useState<number | null>(initialMonth);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    const yearsQuery = useGetPayrolls({ page: 1, limit: 1 });
    const years = [...(yearsQuery.data?.years ?? [])].sort((a, b) => b - a);
    const year = selectedYear ?? years[0] ?? null;

    const periodsQuery = useGetPayrolls({
        page: 1,
        limit: 12,
        status: "PROCESSED",
        ...(year !== null && { year }),
    });

    const periods = (periodsQuery.data?.payrolls ?? []).filter(
        (payroll) => payroll.year === year && payroll.status === "PROCESSED"
    );

    const months = periods.map((payroll) => payroll.month).sort((a, b) => b - a);
    const month = selectedMonth ?? months[0] ?? null;
    const payrollId = periods.find((payroll) => payroll.month === month)?.id;
    const searchTerm = search.trim();

    const payslipsQuery = useGetPayrollPayslips(payrollId, {
        page,
        limit: 25,
        ...(searchTerm && { search: searchTerm }),
    });

    const { data } = payslipsQuery;

    const isLoading =
        yearsQuery.isLoading || periodsQuery.isLoading || payslipsQuery.isLoading;

    const isError =
        yearsQuery.isError || periodsQuery.isError || payslipsQuery.isError;

    const handleYearChange = (value: number) => {
        setSelectedYear(value);
        setSelectedMonth(null);
        setPage(1);
    };

    const handleMonthChange = (value: number) => {
        setSelectedMonth(value);
        setPage(1);
    };

    const handleSearch = (value: string) => {
        setSearch(value);
        setPage(1);
    };

    return (
        <div>
            <header>
                <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                    Payslips
                </h1>
            </header>

            <section className="mt-4 overflow-hidden rounded-lg lg:border lg:border-border lg:bg-white">
                <PayslipsFilters
                    year={year}
                    years={years}
                    onYearChange={handleYearChange}
                    month={month}
                    months={months}
                    onMonthChange={handleMonthChange}
                    search={search}
                    onSearch={handleSearch}
                    total={data?.pagination.total ?? 0}
                />

                {isLoading ? (
                    <div className="flex h-40 items-center justify-center">
                        <p role="status" className="text-sm text-muted-foreground">
                            Loading payslips...
                        </p>
                    </div>
                ) : isError ? (
                    <div className="flex h-40 items-center justify-center">
                        <p role="alert" className="text-sm text-red-500">
                            Failed to load payslips. Please try again.
                        </p>
                    </div>
                ) : data?.payslips.length ? (
                    <>
                        <PayslipsTable payslips={data.payslips} />

                        <PayslipsPagination
                            pagination={data.pagination}
                            onPageChange={setPage}
                        />
                    </>
                ) : (
                    <div className="flex h-40 items-center justify-center px-4">
                        {!payrollId ? (
                            <EmptyState
                                title="No processed payrolls"
                                description={
                                    year === null
                                        ? "Process a monthly payroll to get started."
                                        : `There are no processed payrolls for ${year}.`
                                }
                            />
                        ) : searchTerm ? (
                            <EmptyState
                                title="No matching payslips"
                                description="Try a different employee name or ID."
                            />
                        ) : (
                            <EmptyState
                                title="No payslips generated yet"
                                description="Generate payslips from Monthly Payroll Details for this month."
                            />
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Payslips;