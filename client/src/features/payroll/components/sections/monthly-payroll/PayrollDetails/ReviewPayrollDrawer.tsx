import { Button } from "@/components/ui/button";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import type {
    PayrollDetails,
    SkippedPayrollEmployee,
} from "@/features/payroll/types/payroll.types";

type ReviewPayrollDrawerProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    isReviewing: boolean;
    errorMessage?: string | undefined;
    payroll: Pick<
        PayrollDetails,
        | "month"
        | "year"
        | "status"
        | "totalEmployees"
        | "totalGross"
        | "totalPaye"
        | "totalDeductions"
        | "totalNetPay"
        | "skippedEmployees"
    >;
};

const currency = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
});

const monthAndYear = new Intl.DateTimeFormat("en-NG", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
});

const skipReasonLabels: Record<SkippedPayrollEmployee["reason"], string> = {
    SALARY_NOT_CONFIGURED: "No salary record covers this period.",
    NO_SALARY_FOR_PAYROLL_PERIOD: "No eligible salary days in this period.",
};

// Inside ReviewPayrollDrawer, before return
const hairline = "border-[rgba(156,163,175,0.20)]!";

export default function ReviewPayrollDrawer({
    open,
    onOpenChange,
    onConfirm,
    isReviewing,
    errorMessage,
    payroll,
}: ReviewPayrollDrawerProps) {
    const period = monthAndYear.format(
        new Date(Date.UTC(payroll.year, payroll.month - 1, 1))
    );
    const skippedCount = payroll.skippedEmployees.length;
    const totals = [
        { label: "Gross payroll", amount: payroll.totalGross },
        { label: "PAYE", amount: payroll.totalPaye },
        { label: "Other deductions", amount: payroll.totalDeductions },
    ];
    return (
        <Sheet
            open={open}
            onOpenChange={(nextOpen) => {
                if (!isReviewing) onOpenChange(nextOpen);
            }}
        >
            <SheetContent
                side="right"
                className="flex h-full w-full flex-col gap-0 overflow-hidden border-gray-200 bg-background p-0 dark:border-gray-800 sm:max-w-140"
            >
                <SheetHeader className="shrink-0 border-b border-gray-200 px-6 py-5 pr-14 text-left dark:border-gray-800">
                    <SheetTitle className="text-xl font-semibold tracking-tight">
                        Review payroll
                    </SheetTitle>
                    <SheetDescription>{period}</SheetDescription>
                </SheetHeader>

                <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                    <dl className="grid grid-cols-[minmax(0,1fr)_auto] divide-x divide-gray-100 border-b border-gray-100 bg-gray-50 dark:divide-gray-800 dark:border-gray-800 dark:bg-gray-900/40">
                        <div className="min-w-0 px-6 py-5">
                            <dt className="text-xs font-medium text-muted-foreground">
                                Net payroll
                            </dt>
                            <dd className="mt-1 wrap-break-word text-xl font-semibold tracking-tight tabular-nums sm:text-2xl">
                                {currency.format(Number(payroll.totalNetPay))}
                            </dd>
                        </div>
                        <div className="px-4 py-5 text-right sm:px-6">
                            <dt className="text-xs font-medium text-muted-foreground">
                                Included
                            </dt>
                            <dd className="mt-1 text-xl font-semibold tabular-nums sm:text-2xl">
                                {payroll.totalEmployees}
                            </dd>
                        </div>
                    </dl>

                    <div className={`space-y-7 rounded-lg border px-6 py-6 ${hairline}`}>
                        <details
                            key={`${payroll.year}-${payroll.month}-${skippedCount}`}
                            open={skippedCount > 0}
                            className={`group rounded-lg border ${hairline}`}
                        >
                            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-lg px-4 py-3 text-sm font-medium focus-visible:outline-2 focus-visible:outline-gray-500 [&::-webkit-details-marker]:hidden">
                                <span>Skipped employees ({skippedCount})</span>
                                <span
                                    aria-hidden="true"
                                    className={`size-2 shrink-0 rotate-45 border-b border-r group-open:rotate-[-135deg] ${hairline}`}
                                />
                            </summary>

                            {skippedCount > 0 ? (
                                <ul className={`border-t ${hairline}`}>
                                    {payroll.skippedEmployees.map((employee) => (
                                        <li
                                            key={employee.employeeId}
                                            className={`border-b px-4 py-3 text-sm last:border-b-0 ${hairline}`}
                                        >
                                            <p className="wrap-break-word font-medium">
                                                {employee.employeeName}
                                            </p>
                                            <p className="mt-1 text-muted-foreground">
                                                {skipReasonLabels[employee.reason]}
                                            </p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className={`border-t px-4 py-3 text-sm text-muted-foreground ${hairline}`}>
                                    No employees skipped.
                                </p>
                            )}
                        </details>

                        <section aria-label="Payroll breakdown">
                            <h3 className={`border-b pb-3 text-sm font-semibold ${hairline}`}>
                                Payroll breakdown
                            </h3>

                            <dl>
                                {totals.map(({ label, amount }) => (
                                    <div
                                        key={label}
                                        className={`flex flex-wrap justify-between gap-x-4 gap-y-1 border-b py-3 text-sm last:border-b-0 ${hairline}`}
                                    >
                                        <dt className="text-muted-foreground">{label}</dt>
                                        <dd className="ml-auto font-medium tabular-nums">
                                            {currency.format(Number(amount))}
                                        </dd>
                                    </div>
                                ))}
                            </dl>
                        </section>
                    </div>
                </div>

                <SheetFooter className="m-0 shrink-0 flex-col gap-3 border-t border-gray-200 bg-background px-6 py-4 dark:border-gray-800 sm:flex-col">
                    {errorMessage && (
                        <p role="alert" className="text-sm text-destructive">
                            {errorMessage}
                        </p>
                    )}

                    <div className="grid gap-2 sm:grid-cols-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="h-11 border-gray-200 dark:border-gray-800"
                            disabled={isReviewing}
                            onClick={() => onOpenChange(false)}
                        >
                            Back to breakdown
                        </Button>
                        <Button
                            type="button"
                            className="h-11"
                            disabled={isReviewing || payroll.status !== "CALCULATED"}
                            onClick={onConfirm}
                        >
                            {isReviewing ? "Marking as reviewed…" : "Mark as reviewed"}
                        </Button>
                    </div>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}