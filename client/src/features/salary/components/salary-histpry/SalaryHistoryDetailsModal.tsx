import {
    CalendarDays,
    Clock3,
    Wallet,
    Banknote,
    Receipt,
    History,
    TrendingUp,
    CircleDollarSign,
    Info, 
} from "lucide-react";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import type { EmployeeSalaryHistory } from "../../types/salary.types";

interface SalaryHistoryDetailsModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    salary: EmployeeSalaryHistory | null;
}

const BRAND_COLOR = "#1078A9";

const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 2,
    }).format(amount);

const formatDate = (date: string | null) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-NG", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

const formatFrequency = (frequency: string) =>
    frequency.replaceAll("_", " ");

const SalaryHistoryDetailsModal = ({
    open,
    onOpenChange,
    salary,
}: SalaryHistoryDetailsModalProps) => {
    if (!salary) return null;

    const overviewItems = [
        {
            label: "Annual Base Salary",
            value: formatCurrency(salary.annualBaseSalary),
            icon: Wallet,
        },
        {
            label: "Monthly Gross",
            value: formatCurrency(salary.monthlyGross),
            icon: Banknote,
        },
        {
            label: "PAYE Deduction",
            value: formatCurrency(salary.paye),
            icon: Receipt,
        },
        {
            label: "Net Pay",
            value: formatCurrency(salary.netPay),
            icon: CircleDollarSign,
            highlight: true,
        },
    ];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="flex max-h-[92vh] max-w-4xl flex-col gap-0 overflow-hidden border border-gray-200 bg-white p-0 shadow-2xl">

                {/* Header */}
                <DialogHeader className="shrink-0 border-b border-gray-100 px-6 py-5 sm:px-8">
                    <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div
                                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                                style={{
                                    backgroundColor: `${BRAND_COLOR}12`,
                                    color: BRAND_COLOR,
                                }}
                            >
                                <History className="h-5 w-5" />
                            </div>

                            <div>
                                <DialogTitle className="text-lg font-semibold tracking-tight text-gray-900">
                                    Salary History Details
                                </DialogTitle>

                                <DialogDescription className="mt-1 max-w-lg text-sm leading-5 text-gray-500">
                                    Historical compensation record and salary breakdown
                                    for this employee.
                                </DialogDescription>
                            </div>
                        </div>

                        <Badge
                            variant="outline"
                            className="shrink-0 border-amber-200 bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700"
                        >
                            <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-amber-500" />
                            Ended
                        </Badge>
                    </div>
                </DialogHeader>

                {/* Scrollable content */}
                <div className="min-h-0 flex-1 space-y-7 overflow-y-auto px-6 py-6 sm:px-8">

                    {/* Salary period */}
                    <section>
                        <div className="mb-3 flex items-center justify-between">
                            <h3 className="text-sm font-semibold text-gray-900">
                                Salary Period
                            </h3>

                            <span className="text-xs text-gray-400">
                                Historical record
                            </span>
                        </div>

                        <div className="grid gap-3 rounded-xl border border-gray-200 bg-gray-50/70 p-4 sm:grid-cols-2">
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white">
                                    <CalendarDays
                                        className="h-4 w-4"
                                        style={{ color: BRAND_COLOR }}
                                    />
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        Effective Date
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-gray-900">
                                        {formatDate(salary.effectiveDate)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white">
                                    <Clock3
                                        className="h-4 w-4"
                                        style={{ color: BRAND_COLOR }}
                                    />
                                </div>

                                <div>
                                    <p className="text-xs text-gray-500">
                                        End Date
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-gray-900">
                                        {formatDate(salary.endDate)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Financial overview */}
                    <section>
                        <div className="mb-4">
                            <h3 className="text-sm font-semibold text-gray-900">
                                Compensation Overview
                            </h3>
                            <p className="mt-1 text-xs text-gray-500">
                                Financial summary of the historical salary structure.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
                            {overviewItems.map((item) => {
                                const Icon = item.icon;

                                return (
                                    <div
                                        key={item.label}
                                        className={`rounded-xl border p-4 ${item.highlight
                                                ? "border-[#1078A9]/25 bg-[#1078A9]/4"
                                                : "border-gray-200 bg-white"
                                            }`}
                                    >
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-xs font-medium text-gray-500">
                                                {item.label}
                                            </span>

                                            <Icon
                                                className="h-4 w-4 shrink-0"
                                                style={{
                                                    color: item.highlight
                                                        ? BRAND_COLOR
                                                        : "#9CA3AF",
                                                }}
                                            />
                                        </div>

                                        <p
                                            className={`mt-3 wrap-break-word text-lg font-semibold tracking-tight ${item.highlight
                                                    ? "text-[#1078A9]"
                                                    : "text-gray-900"
                                                }`}
                                        >
                                            {item.value}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* Salary components */}
                    <section>
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Salary Components
                                </h3>
                                <p className="mt-1 text-xs text-gray-500">
                                    Breakdown of the annual base salary.
                                </p>
                            </div>

                            <Badge
                                variant="secondary"
                                className="bg-gray-100 text-gray-600"
                            >
                                {salary.components.length} Components
                            </Badge>
                        </div>

                        <div className="overflow-hidden rounded-xl border border-gray-200">
                            <div className="grid grid-cols-[1.2fr_0.7fr_1.2fr] gap-3 bg-gray-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:px-5">
                                <span>Component</span>
                                <span className="text-center">Percentage</span>
                                <span className="text-right">Annual Amount</span>
                            </div>

                            {salary.components.map((component) => (
                                <div
                                    key={component.id}
                                    className="grid grid-cols-[1.2fr_0.7fr_1.2fr] items-center gap-3 border-t border-gray-100 px-4 py-3.5 sm:px-5"
                                >
                                    <span className="text-sm font-medium text-gray-800">
                                        {component.name}
                                    </span>

                                    <span className="text-center text-sm text-gray-600">
                                        {component.percentage}%
                                    </span>

                                    <span className="text-right text-sm font-semibold tabular-nums text-gray-900">
                                        {formatCurrency(component.annualAmount)}
                                    </span>
                                </div>
                            ))}

                           <div className="grid grid-cols-[1.2fr_0.7fr_1.2fr] items-center gap-3 border-t border-gray-200 bg-gray-50 px-4 py-4 sm:px-5">
    <span className="text-sm font-semibold text-gray-900">
        Total
    </span>

    <span className="text-center text-sm font-semibold text-gray-700">
        {salary.components.reduce(
            (total, component) => total + Number(component.percentage),
            0
        )}%
    </span>

    <span className="text-right text-sm font-bold tabular-nums text-gray-900">
        {formatCurrency(salary.annualBaseSalary)}
    </span>
</div>
                        </div>
                    </section>

                    {/* Additional earnings */}
                    <section>
                        <div className="mb-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900">
                                    Additional Earnings
                                </h3>
                                <p className="mt-1 text-xs text-gray-500">
                                    Other earnings attached to this salary structure.
                                </p>
                            </div>

                            <Badge
                                variant="secondary"
                                className="bg-gray-100 text-gray-600"
                            >
                                {salary.additionalEarnings.length} Earnings
                            </Badge>
                        </div>

                        {salary.additionalEarnings.length === 0 ? (
                            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 px-4 py-8 text-center">
                                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                    <TrendingUp className="h-5 w-5 text-gray-400" />
                                </div>

                                <p className="text-sm font-medium text-gray-700">
                                    No additional earnings
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    No additional earnings were configured for this period.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-hidden rounded-xl border border-gray-200">
                                <div className="grid grid-cols-[1.2fr_0.8fr] gap-3 bg-gray-50 px-4 py-3 text-[11px] font-semibold uppercase tracking-wide text-gray-500 sm:px-5">
                                    <span>Earning</span>
                                    <span className="text-right">Amount</span>
                                </div>

                                {salary.additionalEarnings.map((earning) => (
                                    <div
                                        key={earning.id}
                                        className="grid grid-cols-[1.2fr_0.8fr] items-center gap-3 border-t border-gray-100 px-4 py-3.5 sm:px-5"
                                    >
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-gray-900">
                                                {earning.name}
                                            </p>

                                            <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                                                <Badge
                                                    variant="outline"
                                                    className="border-gray-200 bg-white text-[10px] font-medium text-gray-600"
                                                >
                                                    {earning.calculationType === "PERCENTAGE"
                                                        ? `${earning.percentage ?? 0}%`
                                                        : "Fixed"}
                                                </Badge>

                                                <span className="text-[11px] text-gray-400">
                                                    {formatFrequency(earning.frequency)}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-right text-sm font-semibold tabular-nums text-gray-900">
                                            {formatCurrency(earning.amount)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    {/* Historical notice */}
                    <div className="flex items-start gap-3 rounded-lg border border-blue-100 bg-blue-50/60 p-3.5">
                        <Info className="mt-0.5 h-4 w-4 shrink-0 text-[#1078A9]" />

                        <p className="text-xs leading-5 text-gray-600">
                            This is a historical salary record. The information
                            shown reflects the employee's compensation structure
                            during the period indicated above. It is read-only
                            and does not represent their current salary.
                        </p>
                    </div>
                </div>

                {/* Fixed footer */}
                <div className="flex shrink-0 items-center justify-between gap-3 border-t border-gray-100 bg-white px-6 py-4 sm:px-8">
                    <p className="hidden text-xs text-gray-400 sm:block">
                        Historical salary record
                    </p>

                    <Button
                        variant="outline"
                        className="min-w-24 border-gray-200 cursor-pointer hover:bg-gray-100"
                        onClick={() => onOpenChange(false)}
                    >
                        Close
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default SalaryHistoryDetailsModal;