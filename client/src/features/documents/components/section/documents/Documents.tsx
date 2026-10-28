
import { useState } from "react";
import DocumentFilters from "./DocumentsFilters";
import DocumentTable from "./DocumentTable";
import DocumentDetails from "./DocumentDetails";
import DocumentsCardList from "./DocumentsCardList";

import { useGetDocuments } from "@/features/documents/hooks/useGetDocuments";

import useDownloadDocument from "@/features/documents/hooks/useDownloadDocument";
import useDeleteDocument from "@/features/documents/hooks/useDeleteDocument";

const Documents = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [documentType, setDocumentType] = useState("all");

  const [selectedDocumentId, setSelectedDocumentId] =
    useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { data: documents } = useGetDocuments({
    search: search || undefined,
    status: status === "all" ? undefined : status,
    document_type_id:
      documentType === "all" ? undefined : documentType,
  });

  const { mutateAsync: deleteDocument } = useDeleteDocument();
  const { downloadDocument } = useDownloadDocument();

  const documentList = documents?.data ?? [];

  const total = documentList.length;
  const pending = documentList.filter(
    (document) => document.status === "pending"
  ).length;
  const approved = documentList.filter(
    (document) => document.status === "approved"
  ).length;
  const rejected = documentList.filter(
    (document) => document.status === "rejected"
  ).length;

  const handleDocumentClick = (documentId: string) => {
    setSelectedDocumentId(documentId);
    setDetailsOpen(true);
  };

  const handleDeleteDocument = async (documentId: string) => {
    await deleteDocument(documentId);
  };

  const handleDownloadDocument = async (documentId: string) => {
    await downloadDocument(documentId);
  };

  return (
    <div>
      <section className="overflow-hidden rounded-lg border border-border bg-white">
        <DocumentFilters
          search={search}
          onSearch={setSearch}
          status={status}
          onStatusChange={setStatus}
          documentType={documentType}
          onDocumentTypeChange={setDocumentType}
          total={total}
          pending={pending}
          approved={approved}
          rejected={rejected}
        />

        {/* Tablet + Desktop */}
        <div className="hidden md:block">
          <DocumentTable
            documents={documentList}
            onDocumentClick={handleDocumentClick}
            onDeleteDocument={handleDeleteDocument}
            onDownloadDocument={handleDownloadDocument}
          />
        </div>

        <DocumentDetails
          documentId={selectedDocumentId}
          open={detailsOpen}
          onClose={() => setDetailsOpen(false)}
        />

        {/* Mobile */}
        <div className="grid gap-3 md:hidden">
          <DocumentsCardList
            documents={documentList}
            onDocumentClick={handleDocumentClick}
          />
        </div>
      </section>
    </div>
  );
};

export default Documents;
