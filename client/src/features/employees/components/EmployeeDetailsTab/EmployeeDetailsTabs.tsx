import {
  FileText,
  GraduationCap,
  LayoutDashboard,
  Wallet,
} from "lucide-react";

export type EmployeeDetailsTab =
  | "overview"
  | "documents"
  | "salary"
  | "onboarding";

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
  {
    id: "onboarding" as const,
    label: "Onboarding",
    icon: GraduationCap,
  },
];

const EmployeeDetailsTabs = ({
  activeTab,
  onTabChange,
}: EmployeeDetailsTabsProps) => {
  return (
    <div className="mt-6 border-b border-gray-200">
      <div className="grid grid-cols-2 gap-x-3 sm:gap-x-6 lg:flex lg:gap-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex min-w-0 items-center justify-center gap-2 px-2 py-3 text-center text-sm font-medium transition-colors cursor-pointer lg:flex-none lg:justify-start lg:px-0 ${
                isActive
                  ? "text-[#1078A9]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />

              <span className="truncate">{tab.label}</span>

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
