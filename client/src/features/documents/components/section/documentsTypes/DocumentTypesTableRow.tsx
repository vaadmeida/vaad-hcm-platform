import type { DocumentType } from "@/features/documents/types/documents.types";
import { MoreHorizontal } from "lucide-react";

interface DocumentTypesTableRowProps {
    documentType: DocumentType;
}

const DocumentTypesTableRow = ({
    documentType,
}: DocumentTypesTableRowProps) => {
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
        <tr className="last:border-none hover:bg-gray-50">
            {/* Document Type */}
            <td className="px-3 py-3">
                <p className="truncate text-sm font-medium text-gray-900">
                    {documentType.name}
                </p>
            </td>

            {/* Requirement */}
            <td className="px-3 py-3">
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${requirementStyles}`}
                >
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${requirementDot}`}
                    />

                    {documentType.isRequired
                        ? "Required"
                        : "Optional"}
                </span>
            </td>

            {/* Expiry */}
            <td className="hidden px-3 py-3 xl:table-cell">
                <span className="text-sm text-gray-700">
                    {documentType.hasExpiry ? "Yes" : "No"}
                </span>
            </td>

            {/* Status */}
            <td className="px-3 py-3">
                <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyles}`}
                >
                    <span
                        className={`h-1.5 w-1.5 rounded-full ${statusDot}`}
                    />

                    {documentType.isActive ? "Active" : "Inactive"}
                </span>
            </td>

            {/* Actions */}
            <td className="px-3 py-3 text-right">
                <button
                    type="button"
                    title="Document type actions"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-gray-100 hover:text-gray-900"
                >
                    <MoreHorizontal className="h-4 w-4" />
                </button>
            </td>
        </tr>
    );
};

export default DocumentTypesTableRow;