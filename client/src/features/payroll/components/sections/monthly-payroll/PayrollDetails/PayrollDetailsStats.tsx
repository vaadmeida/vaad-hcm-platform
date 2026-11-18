import {
    Users,
    Wallet,
    Receipt,
    Banknote,
} from "lucide-react";

import StatsCard from "@/features/dashboard/components/StatsCard";
import GlobalStatsOverview from "@/features/dashboard/components/GlobalStatsOverview";
import ErrorState from "@/components/common/ErrorState";
import { useGetPayrollById } from "@/features/payroll/hooks/useGetPayrollById";


interface PayrollDetailsStatsProps {
    payrollId: string;
}

const PayrollDetailsStats = ({ payrollId }: PayrollDetailsStatsProps) => {
    const { data, isLoading, error, refetch } = useGetPayrollById(payrollId);

    if (isLoading) return <GlobalStatsOverview />;

    if (error) {
        return (
            <ErrorState
                message="Unable to load payroll statistics."
                onRetry={refetch}
            />
        );
    }

    const stats = data?.data.payroll;

    const formatCurrency = (amount: string | number) =>
        new Intl.NumberFormat("en-NG", {
            style: "currency",
            currency: "NGN",
            notation: "compact",
            maximumFractionDigits: 2,
        }).format(Number(amount));


    const cards = [
        {
            title: "Total Employees",
            value: stats?.totalEmployees ?? 0,
            description: "Employees included in this payroll",
            icon: Users,
            iconColor: "action-icon-blue",
        },
        {
            title: "Gross Payroll",
            value: formatCurrency(stats?.totalGross ?? 0),
            description: "Total gross salary and earnings",
            icon: Wallet,
            iconColor: "action-icon-purple",
        },
        {
            title: "Total PAYE",
            value: formatCurrency(stats?.totalPaye ?? 0),
            description: "Total employee PAYE deductions",
            icon: Receipt,
            iconColor: "action-icon-amber",
        },
        {
            title: "Net Payroll",
            value: formatCurrency(stats?.totalNetPay ?? 0),
            description: "Total net salary payable",
            icon: Banknote,
            iconColor: "action-icon-green",
        },
    ];

    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {cards.map((card) => (
                <StatsCard key={card.title} {...card} />
            ))}
        </div>
    );
};

export default PayrollDetailsStats;