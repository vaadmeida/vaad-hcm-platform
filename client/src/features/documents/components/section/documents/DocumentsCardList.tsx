
import type { Document } from "@/features/documents/types/documents.types";
import DocumentCard from "./DocumentCard";

interface DocumentsCardListProps {
  documents: Document[];
  onDocumentClick: (documentId: string) => void;
}

const DocumentsCardList = ({
  documents,
  onDocumentClick,
}: DocumentsCardListProps) => {
  return (
    <div className="grid gap-3 md:hidden">
      {documents.map((document) => (
        <DocumentCard
          key={document.id}
          document={document}
          onClick={onDocumentClick}
        />
      ))}
    </div>
  );
};

export default DocumentsCardList;