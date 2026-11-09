import { Banknote, FileText, Users, Wallet } from "lucide-react";
import StatsCard from "@/features/dashboard/components/StatsCard";

const PayrollStats = () => {
    const stats = {
        totalEmployees: 24,
        grossPayroll: 3850000,
        totalPAYE: 285000,
        netPayroll: 3565000,
    };

    const cards = [
        {
            title: "Total Employees",
            value: stats.totalEmployees,
            description: "Active employees",
            icon: Users,
            iconColor: "action-icon-blue",
        },
        {
            title: "Gross Payroll",
            value: stats.grossPayroll,
            description: "Total monthly earnings (₦)",
            icon: Wallet,
            iconColor: "action-icon-purple",
        },
        {
            title: "Total PAYE",
            value: stats.totalPAYE,
            description: "Total tax deductions (₦)",
            icon: FileText,
            iconColor: "action-icon-amber",
        },
        {
            title: "Net Payroll",
            value: stats.netPayroll,
            description: "Total employee take-home (₦)",
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

export default PayrollStats;