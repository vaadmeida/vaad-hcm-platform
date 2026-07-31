import { FileText, LayoutDashboard, Wallet } from 'lucide-react';

export type EmployeeDetailsTab = "overview" | "documents" | "salary";

interface EmployeeDetailsTabsProps {
  activeTab: EmployeeDetailsTab;
  onTabChange: (tab: EmployeeDetailsTab) => void;
}

const tabs = [
  {
    id: "overview" as const,
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "documents" as const,
    label: "Documents",
    icon: FileText,
  },
  {
    id: "salary" as const,
    label: "Salary Structure",
    icon: Wallet,
  },
];


const EmployeeDetailsTabs = ({
  activeTab,
  onTabChange,
}: EmployeeDetailsTabsProps) => {
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
  );
};

export default EmployeeDetailsTabs;
