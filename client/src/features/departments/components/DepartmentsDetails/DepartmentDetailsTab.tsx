import { FileText, LayoutDashboard, Wallet } from "lucide-react";

export type DepartmentDetailsTab = "team members" | "recent activity" | "statistics";

interface DepartmentDetailsTabsProps {
    activeTab: DepartmentDetailsTab;
    onTabChange: (tab: DepartmentDetailsTab) => void;
}

const tabs = [
    {
        id: "team members" as const,
        label: "Team Members",
        icon: LayoutDashboard,
    },
    {
        id: "recent activity" as const,
        label: "Recent Activity",
        icon: FileText,
    },
    {
        id: "statistics" as const,
        label: "Statistics",
        icon: Wallet,
    },
];


const DepartmentDetailsTab = ({
    activeTab,
    onTabChange,
}: DepartmentDetailsTabsProps) => {
    return (
       <div className="mt-6 border-b border-gray-200">
      <div className="flex gap-6 overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`relative flex shrink-0 items-center gap-2 pb-3 text-sm font-medium transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" />

              {tab.label}

              {isActive && (
                <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-[#1078A9]" />
              )}
            </button>
          );
        })}
      </div>
    </div>
    )
}

export default DepartmentDetailsTab
