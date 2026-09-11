import ErrorState from "@/components/common/ErrorState";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import { useExpiringDocuments } from "../../../hooks/useExpiringDocuments";
import EmptyState from "@/components/common/EmptyState";

const ExpiringDocuments = () => {
    const { data, isLoading, error, refetch } = useExpiringDocuments();

    if (error) {
        return (
            <ErrorState
                message="Unable to load expiring documents."
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
                    <h2 className="text-base font-semibold text-secondary">
                        Expiring Documents
                    </h2>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                        Employee documents approaching expiry
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
                        title="No expiring documents"
                        description="There are no documents approaching expiry."
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

                        const expiryDate = new Date(
                            document.expiryDate
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
                                    <p className="truncate text-sm font-semibold text-secondary">
                                        {employeeName}
                                    </p>

                                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                                        {document.fileName}
                                    </p>
                                </div>

                                {/* Expiry Date */}
                                <div className="min-w-0 text-right">
                                    <p className="text-xs font-medium text-secondary">
                                        {expiryDate}
                                    </p>

                                    <p className="mt-0.5 text-[11px] text-red-500">
                                        Expiring soon
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

export default ExpiringDocuments;