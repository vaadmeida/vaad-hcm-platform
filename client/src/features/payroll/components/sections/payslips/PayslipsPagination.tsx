import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { PayrollPayslipsResult } from "@/features/payslips/types/payslip.types";

type PayslipsPaginationProps = {
    pagination: PayrollPayslipsResult["pagination"];
    onPageChange: (page: number) => void;
};

const PayslipsPagination = ({
    pagination,
    onPageChange,
}: PayslipsPaginationProps) => {
    const { page, limit, total, totalPages } = pagination;

    if (total === 0) return null;

    const first = (page - 1) * limit + 1;
    const last = Math.min(page * limit, total);

    return (
        <div className="flex flex-col gap-3 border-t border-gray-200/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-muted-foreground">
                Showing{" "}
                <span className="font-medium tabular-nums text-foreground">
                    {first}–{last}
                </span>{" "}
                of{" "}
                <span className="font-medium tabular-nums text-foreground">
                    {total}
                </span>{" "}
                {total === 1 ? "payslip" : "payslips"}
            </p>

            {totalPages > 1 && (
                <nav
                    aria-label="Payslips pagination"
                    className="flex flex-wrap items-center gap-2"
                >
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-gray-200/70 shadow-none"
                        disabled={page <= 1}
                        onClick={() => onPageChange(page - 1)}
                    >
                        <ChevronLeft aria-hidden="true" className="size-4" />
                        Previous
                    </Button>

                    <span className="px-1 text-sm tabular-nums text-muted-foreground">
                        Page {page} of {totalPages}
                    </span>

                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="border-gray-200/70 shadow-none"
                        disabled={page >= totalPages}
                        onClick={() => onPageChange(page + 1)}
                    >
                        Next
                        <ChevronRight aria-hidden="true" className="size-4" />
                    </Button>
                </nav>
            )}
        </div>
    );
};

export default PayslipsPagination;