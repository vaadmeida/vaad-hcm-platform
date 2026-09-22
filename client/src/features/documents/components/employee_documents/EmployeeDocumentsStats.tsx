import ErrorState from "@/components/common/ErrorState";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import {
    AlertCircle,
    CircleCheck,
    Clock,
    FileText,
} from "lucide-react";
import StatsCard from "@/features/dashboard/components/StatsCard";
import { useMyDocumentStats } from "../../hooks/useMyDocumentsStats";


const EmployeeDocumentsStats = () => {
    const { isLoading, data, error, refetch } = useMyDocumentStats();

    if (error) {
        return (
            <ErrorState
                message="Unable to load document statistics."
                onRetry={refetch}
            />
        );
    }

    if (isLoading) {
        return <SkeletonLoader />;
    }

    const stats = data;

    const cards = [
        {
            title: "Total Documents",
            value: stats?.total ?? 0,
            description: "Documents required for your employment",
            icon: FileText,
            iconColor: "action-icon-blue",
        },
        {
            title: "Approved",
            value: stats?.approved ?? 0,
            description: "Documents approved",
            icon: CircleCheck,
            iconColor: "action-icon-green",
        },
        {
            title: "Pending",
            value: stats?.pending ?? 0,
            description: "Documents awaiting review",
            icon: Clock,
            iconColor: "action-icon-amber",
        },
        {
            title: "Needs Attention",
            value: stats?.needsAttention ?? 0,
            description: "Documents requiring your attention",
            icon: AlertCircle,
            iconColor: "action-icon-red",
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

export default EmployeeDocumentsStats;