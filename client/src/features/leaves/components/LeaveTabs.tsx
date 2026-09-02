import { useAuthStore } from "@/store/auth.store";
import { FileText, LayoutDashboard, Settings, Wallet } from "lucide-react";


export type LeaveTabsTypes =
    | "Overview"
    | "Requests"
    | "Balances"
    | "Leave Types"
    | "My Leaves";

interface LeaveTabsProps {
    activeTab: LeaveTabsTypes;
    onTabChange: (tab: LeaveTabsTypes) => void;
}

const tabs = [
    {
        id: "Overview" as const,
        label: "Overview",
        icon: LayoutDashboard,
    },
    {
        id: "Requests" as const,
        label: "Requests",
        icon: FileText,
    },
    {
        id: "Balances" as const,
        label: "Balances",
        icon: Wallet,
    },
    {
        id: "Leave Types" as const,
        label: "Leave Types",
        icon: Settings,
    },
    {
        id: "My Leaves" as const,
        label: "My Leaves",
        icon: Settings,
    },
];

const LeaveTabs = ({ activeTab, onTabChange }: LeaveTabsProps) => {
    const user = useAuthStore((state) => state.user);

    const visibleTabs = tabs.filter((tab) => !(tab.id === "My Leaves" && user?.role === "admin"));

    return (
        <div className="mt-6 border-b border-gray-200">
            <div className="flex gap-6 overflow-x-auto">
                {visibleTabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => onTabChange(tab.id)}
                            className={`relative flex shrink-0 cursor-pointer items-center gap-2 pb-3 text-sm font-medium transition-colors ${
                                isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                            }`}
                        >
                            <Icon className="h-4 w-4" />

                            {tab.label}

                            {isActive && (
                                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-primary" />
                            )}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default LeaveTabs;