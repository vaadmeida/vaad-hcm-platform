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
            <div className="flex gap-6 overflow-x-auto">
                {tabs.map((tab) => {
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

export default DocumentTabs;