import { Banknote, FileText, Users, Wallet } from "lucide-react";

import { Button } from "@/components/ui/button";
import StatsCard from "@/features/dashboard/components/StatsCard";
import { usePayrollOverview } from "@/features/payroll/hooks/usePayrollOverview";

const currency = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    notation: "compact",
    compactDisplay: "short",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
});

const formatPayrollAmount = (amount: string | number) =>
    currency.format(Number(amount)).replace(/[KM]$/, (unit) => unit.toLowerCase());

const periodFormatter = new Intl.DateTimeFormat("en-NG", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
});

const PayrollStats = () => {
    const { data, isLoading, isError, refetch } = usePayrollOverview();

    if (isLoading) {
        return (
            <p role="status" className="py-6 text-sm text-muted-foreground">
                Loading payroll overview…
            </p>
        );
    }

    if (isError || !data) {
        return (
            <div className="flex items-center gap-3 py-6">
                <p role="alert" className="text-sm text-destructive">
                    Unable to load payroll overview.
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

    const { latestPayroll } = data;

    const period = latestPayroll
        ? periodFormatter.format(
            new Date(Date.UTC(latestPayroll.year, latestPayroll.month - 1, 1))
        )
        : null;

    const cards = [
        {
            title: "Employees Paid",
            value: latestPayroll?.totalEmployees ?? "—",
            description: "Employees in this payroll run",
            icon: Users,
            iconColor: "action-icon-blue",
        },
        {
            title: "Gross Payroll",
            value: latestPayroll ? formatPayrollAmount(latestPayroll.totalGross) : "—",
            description: "Total monthly earnings",
            icon: Wallet,
            iconColor: "action-icon-purple",
        },
        {
            title: "Total PAYE",
            value: latestPayroll ? formatPayrollAmount(latestPayroll.totalPaye) : "—",
            description: "Total tax deductions",
            icon: FileText,
            iconColor: "action-icon-amber",
        },
        {
            title: "Net Payroll",
            value: latestPayroll ? formatPayrollAmount(latestPayroll.totalNetPay) : "—",
            description: "Total employee take-home",
            icon: Banknote,
            iconColor: "action-icon-green",
        },
    ];

    return (
        <section aria-label="Payroll overview" className="space-y-4">
            <p className="text-sm text-muted-foreground">
                {period ? `Latest processed payroll · ${period}` : "No processed payroll yet"}
            </p>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {cards.map((card) => (
                    <StatsCard key={card.title} {...card} />
                ))}
            </div>
        </section>
    );
};

export default PayrollStats;