import { FileText, LayoutDashboard, Settings } from "lucide-react";

export type DocumentTabsTypes =
    | "Overview"
    | "Documents"
    | "Document Types";

interface DocumentTabsProps {
    activeTab: DocumentTabsTypes;
    onTabChange: (tab: DocumentTabsTypes) => void;
}

const tabs = [
    {
        id: "Overview" as const,
        label: "Overview",
        icon: LayoutDashboard,
    },
    {
        id: "Documents" as const,
        label: "Documents",
        icon: FileText,
    },
    {
        id: "Document Types" as const,
        label: "Document Types",
        icon: Settings,
    },
];

const DocumentTabs = ({
    activeTab,
    onTabChange,
}: DocumentTabsProps) => {
    return (
        <div className="mt-6 border-b border-gray-200">
            <div className="grid grid-cols-3 gap-2 sm:flex sm:gap-6">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;

                    return (
                        <button
                            key={tab.id}
                            type="button"
                            onClick={() => onTabChange(tab.id)}
                            className={`relative flex min-w-0 cursor-pointer flex-col items-center justify-center gap-1 pb-3 text-center text-xs font-medium transition-colors sm:flex-row sm:gap-2 sm:text-sm ${isActive
                                    ? "text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                                }`}
                        >
                            <Icon className="h-4 w-4 shrink-0" />

                            <span className="truncate">{tab.label}</span>

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

export default DocumentTabs;