import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePayrollOverview } from "@/features/payroll/hooks/usePayrollOverview";

type PayrollActivityProps = {
    onOpenPayroll: (payrollId: string) => void;
    onViewAllPayrolls: () => void;
};

const periodFormatter = new Intl.DateTimeFormat("en-NG", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
});

const currency = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
});

const nextStep = {
    DRAFT: "Awaiting calculation",
    CALCULATED: "Awaiting review",
    REVIEWED: "Awaiting approval",
    APPROVED: "Awaiting payment confirmation",
};

const formatPeriod = (year: number, month: number) =>
    periodFormatter.format(new Date(Date.UTC(year, month - 1, 1)));

const PayrollActivity = ({
    onOpenPayroll,
    onViewAllPayrolls,
}: PayrollActivityProps) => {
    const { data, isLoading, refetch } = usePayrollOverview();

    if (isLoading) {
        return (
            <p role="status" className="mt-8 text-sm text-muted-foreground">
                Loading payroll activity…
            </p>
        );
    }

    if (!data) {
        return (
            <div className="mt-8 flex items-center gap-3">
                <p role="alert" className="text-sm text-destructive">
                    Unable to load payroll activity.
                </p>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => void refetch()}
                >
                    Retry
                </Button>
            </div>
        );
    }

    const { inProgressPayroll, recentProcessedPayrolls } = data;

    return (
        <section className="mt-6 overflow-hidden rounded-xl border border-gray-200/60 bg-white">
            <div className="px-4 py-4 sm:px-6">
                <h2 className="text-base font-semibold text-foreground">
                    Payroll activity
                </h2>
            </div>

            <div className="border-y border-gray-200/60 bg-gray-50/80 px-4 py-4 sm:px-6">
                {inProgressPayroll ? (
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                            <p className="text-xs font-medium text-muted-foreground">
                                Payroll in progress
                            </p>
                            <p className="mt-1 text-sm font-semibold">
                                {formatPeriod(
                                    inProgressPayroll.year,
                                    inProgressPayroll.month
                                )}
                            </p>
                            <p className="mt-0.5 text-sm text-muted-foreground">
                                {nextStep[inProgressPayroll.status]}
                            </p>
                        </div>

                        <Button
                            type="button"
                            className="h-11 w-full sm:w-auto"
                            onClick={() => onOpenPayroll(inProgressPayroll.id)}
                        >
                            Open payroll
                            <ArrowRight aria-hidden="true" className="size-4" />
                        </Button>
                    </div>
                ) : (
                    <p className="text-sm text-muted-foreground">
                        No payroll in progress.
                    </p>
                )}
            </div>

            <h3 className="px-4 pb-1 pt-4 text-sm font-semibold sm:px-6">
                Recent processed payrolls
            </h3>

            {recentProcessedPayrolls.length > 0 ? (
                <ul className="divide-y divide-gray-200/60 px-4 sm:px-6">
                    {recentProcessedPayrolls.map((payroll) => {
                        const period = formatPeriod(payroll.year, payroll.month);

                        return (
                            <li
                                key={payroll.id}
                                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 py-3 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)_auto] sm:gap-x-5"
                            >
                                <p className="text-sm font-medium">{period}</p>

                                <p className="text-right text-xs text-muted-foreground">
                                    {payroll.totalEmployees}{" "}
                                    {payroll.totalEmployees === 1 ? "employee" : "employees"} paid
                                </p>

                                <p className="min-w-0 wrap-break-word text-sm font-semibold tabular-nums sm:text-right">
                                    <span className="mr-2 text-xs font-normal text-muted-foreground">
                                        Net pay
                                    </span>
                                    {currency.format(Number(payroll.totalNetPay))}
                                </p>

                                <Button
                                    type="button"
                                    variant="outline"
                                    className="h-11 border-gray-200/60 px-3 shadow-none"
                                    aria-label={`View ${period} payroll details`}
                                    onClick={() => onOpenPayroll(payroll.id)}
                                >
                                    View
                                </Button>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="px-4 py-4 text-sm text-muted-foreground sm:px-6">
                    No processed payrolls yet.
                </p>
            )}

            <div className="border-t border-gray-200/60 px-4 py-2 sm:px-6">
                <Button
                    type="button"
                    variant="ghost"
                    className="h-11 w-full justify-between px-0 text-primary sm:w-auto sm:gap-3"
                    onClick={onViewAllPayrolls}
                >
                    View all payrolls
                    <ArrowRight aria-hidden="true" className="size-4" />
                </Button>
            </div>
        </section>
    );
};

export default PayrollActivity;