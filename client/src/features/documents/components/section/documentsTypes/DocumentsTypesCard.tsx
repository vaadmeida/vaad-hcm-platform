import type { DocumentType } from "@/features/documents/types/documents.types";
import { MoreHorizontal } from "lucide-react";

interface DocumentsTypesCardProps {
    documentType: DocumentType;
}

const DocumentsTypesCard = ({
    documentType,
}: DocumentsTypesCardProps) => {
    const requirementStyles = documentType.isRequired
        ? "bg-primary/10 text-primary"
        : "bg-gray-50 text-gray-600";

    const requirementDot = documentType.isRequired
        ? "bg-primary"
        : "bg-gray-400";

    const statusStyles = documentType.isActive
        ? "bg-green-50 text-green-700"
        : "bg-gray-50 text-gray-600";

    const statusDot = documentType.isActive
        ? "bg-green-500"
        : "bg-gray-400";

    return (
        <div className="rounded-lg border border-border bg-white p-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <h3 className="truncate text-sm font-semibold text-gray-900">
                        {documentType.name}
                    </h3>

                    <p className="mt-1 text-xs text-muted-foreground">
                        Document type
                    </p>
                </div>

                <button
                    type="button"
                    title="Document type actions"
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </button>
            </div>

            {/* Details */}
            <div className="mt-4 grid grid-cols-2 gap-4">
                {/* Requirement */}
                <div>
                    <p className="text-xs text-muted-foreground">
                        Requirement
                    </p>

                    <span
                        className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${requirementStyles}`}
                    >
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${requirementDot}`}
                        />

                        {documentType.isRequired
                            ? "Required"
                            : "Optional"}
                    </span>
                </div>

                {/* Expiry */}
                <div>
                    <p className="text-xs text-muted-foreground">
                        Expiry
                    </p>

                    <p className="mt-1.5 text-sm font-medium text-gray-700">
                        {documentType.hasExpiry ? "Yes" : "No"}
                    </p>
                </div>

                {/* Status */}
                <div>
                    <p className="text-xs text-muted-foreground">
                        Status
                    </p>

                    <span
                        className={`mt-1.5 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyles}`}
                    >
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${statusDot}`}
                        />

                        {documentType.isActive
                            ? "Active"
                            : "Inactive"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default DocumentsTypesCard;