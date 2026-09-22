import type { MyDocument } from "@/features/documents/types/documents.types";
import EmployeeDocumentsCard from "./EmployeeDocumentsCard";

interface EmployeeDocumentsCardListProps {
  documents: MyDocument[];
  onDocumentClick: (documentId: string) => void;
}

const EmployeeDocumentsCardList = ({
  documents,
  onDocumentClick,
}: EmployeeDocumentsCardListProps) => {
  return (
    <div className="grid gap-3 md:hidden">
      {documents.map((document) => (
        <EmployeeDocumentsCard
          key={document.id}
          document={document}
          onClick={onDocumentClick}
        />
      ))}
    </div>
  );
};

export default EmployeeDocumentsCardList;