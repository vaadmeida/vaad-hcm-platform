import ErrorState from "@/components/common/ErrorState";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import { CircleCheck, Clock, FileText, XCircle } from "lucide-react";
import StatsCard from "@/features/dashboard/components/StatsCard";
import { useDocumentStats } from "@/features/documents/hooks/useDocumentsStats";


const DocumentsStats = () => {
    const { isLoading, data, error, refetch } = useDocumentStats();

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

    const stats = data?.data;

    const cards = [
        {
            title: "Total Documents",
            value: stats?.total ?? 0,
            description: "Total documents uploaded",
            icon: FileText,
            iconColor: "action-icon-blue",
        },
        {
            title: "Pending Documents",
            value: stats?.pending ?? 0,
            description: "Documents awaiting verification",
            icon: Clock,
            iconColor: "action-icon-amber",
        },
        {
            title: "Verified Documents",
            value: stats?.verified ?? 0,
            description: "Verified employee documents",
            icon: CircleCheck,
            iconColor: "action-icon-green",
        },
        {
            title: "Rejected Documents",
            value: stats?.rejected ?? 0,
            description: "Rejected employee documents",
            icon: XCircle,
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

export default DocumentsStats;
