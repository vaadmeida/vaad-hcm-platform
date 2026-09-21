import type { DocumentType } from "@/features/documents/types/documents.types";
import DocumentsTypesCard from "./DocumentsTypesCard";

interface DocumentsTypesCardListProps {
    documentTypes: DocumentType[];
}

const DocumentsTypesCardList = ({
    documentTypes,
}: DocumentsTypesCardListProps) => {
    if (documentTypes.length === 0) {
        return (
            <div className="rounded-lg border border-border bg-white px-4 py-12 text-center text-sm text-muted-foreground">
                No document types found.
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {documentTypes.map((documentType) => (
                <DocumentsTypesCard
                    key={documentType.id}
                    documentType={documentType}
                />
            ))}
        </div>
    );
};

export default DocumentsTypesCardList;