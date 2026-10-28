import type { Document } from "@/features/documents/types/documents.types";
import DocumentTableRow from "./DocumentTableRow";

interface DocumentTableProps {
  documents: Document[];
  onDocumentClick: (documentId: string) => void;
  onDeleteDocument: (documentId: string) => Promise<void>;
  onDownloadDocument: (documentId: string) => void;
}

const DocumentTable = ({
  documents,
  onDocumentClick,
  onDeleteDocument,
  onDownloadDocument,
}: DocumentTableProps) => {
  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-y border-border bg-muted/10 text-left text-xs font-medium text-muted-foreground">
            <th className="w-[25%] px-3 py-3 pr-5">
              Employee
            </th>

            <th className="hidden w-[20%] px-3 py-3 xl:table-cell">
              Document
            </th>

            <th className="px-4 py-3">
              Document Type
            </th>

            <th className="hidden px-4 py-3 xl:table-cell">
              Uploaded
            </th>

            <th className="hidden px-4 py-3 xl:table-cell">
              Status
            </th>

            <th className="px-4 py-3 text-right">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border">
          {documents.map((document) => (
            <DocumentTableRow
              key={document.id}
              document={document}
              onClick={onDocumentClick}
              onDelete={onDeleteDocument}
              onDownload={onDownloadDocument}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DocumentTable;
