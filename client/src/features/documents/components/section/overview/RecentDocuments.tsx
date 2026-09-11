import ErrorState from "@/components/common/ErrorState";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import { useRecentDocuments } from "../../../hooks/useRecentDocuments";
import EmptyState from "@/components/common/EmptyState";

const RecentDocuments = () => {
    const { data, isLoading, error, refetch } = useRecentDocuments();

    if (error) {
        return (
            <ErrorState
                message="Unable to load recent documents."
                onRetry={refetch}
            />
        );
    }

    if (isLoading) {
        return <SkeletonLoader />;
    }

    const documents = data?.data ?? [];

    return (
        <div className="w-full rounded-xl border border-gray-200 bg-white">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                <div>
                    <h2 className="text-base font-semibold text-[#121417]">
                        Recent Documents
                    </h2>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                        Recently uploaded employee documents
                    </p>
                </div>

                <button
                    type="button"
                    className="text-xs font-medium text-[#1078A9] transition hover:text-[#0d658e]"
                >
                    View all
                </button>
            </div>

            {/* Documents */}
            {documents.length === 0 ? (
                <div className="flex flex-1 items-center justify-center px-5 py-10 text-center">
                    <EmptyState
                        title="No recent documents"
                        description="There are no recently uploaded documents."
                    />
                </div>
            ) : (
                <div className="flex-1 divide-y divide-gray-100">
                    {documents.map((document) => {
                        const employeeName = document.employee.name;

                        const initials = employeeName
                            .split(" ")
                            .map((name) => name[0] ?? "")
                            .join("")
                            .slice(0, 2)
                            .toUpperCase();

                        const uploadedDate = new Date(
                            document.uploadedAt
                        ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        });

                        return (
                            <div
                                key={document.id}
                                className="grid grid-cols-[auto_minmax(0,1fr)_minmax(100px,auto)] items-center gap-4 px-5 py-4 transition hover:bg-gray-50"
                            >
                                {/* Avatar */}
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#1078A9]/10 text-xs font-semibold text-[#1078A9]">
                                    {document.employee.avatar ? (
                                        <img
                                            src={document.employee.avatar}
                                            alt={employeeName}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        initials
                                    )}
                                </div>

                                {/* Employee + Document */}
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold text-[#121417]">
                                        {employeeName}
                                    </p>

                                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                        {document.fileName}
                                    </p>
                                </div>

                                {/* Date + Status */}
                                <div className="min-w-0 text-right">
                                    <p className="text-xs font-medium text-[#121417]">
                                        {uploadedDate}
                                    </p>

                                    <p className="mt-0.5 text-[11px] capitalize text-muted-foreground">
                                        {document.status}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default RecentDocuments;