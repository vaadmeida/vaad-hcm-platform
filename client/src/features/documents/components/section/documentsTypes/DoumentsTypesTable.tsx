import type { DocumentType } from "@/features/documents/types/documents.types";
import DocumentTypesTableRow from "./DocumentTypesTableRow";

interface DocumentTypesTableProps {
    documentTypes: DocumentType[];
}

const DocumentTypesTable = ({
    documentTypes,
}: DocumentTypesTableProps) => {
    return (
        <div className="w-full overflow-x-auto">
            <table className="w-full border-collapse text-sm">
                <thead>
                    <tr className="border-y border-border bg-muted/10 text-left text-xs font-medium text-muted-foreground">
                        <th className="px-4 py-3 pr-2">
                            Document Type
                        </th>
                        
                        <th className="px-4 py-3">
                            Requirement
                        </th>

                        <th className="hidden px-4 py-3 xl:table-cell">
                            Expiry
                        </th>

                        <th className="px-4 py-3">
                            Status
                        </th>

                        <th className="px-4 py-3 text-right">
                            Actions
                        </th>
                    </tr>
                </thead>

                <tbody className="divide-y divide-border">
                    {documentTypes.length > 0 ? (
                        documentTypes.map((documentType) => (
                            <DocumentTypesTableRow
                                key={documentType.id}
                                documentType={documentType}
                            />
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={7}
                                className="px-4 py-12 text-center text-sm text-muted-foreground"
                            >
                                No document types found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default DocumentTypesTable;