import { useState } from "react";
import DocumentFilters from "./DocumentsFilters";
import DocumentTable from "./DocumentTable";
import DocumentDetails from "./DocumentDetails";
import DocumentsCardList from "./DocumentsCardList";
import { useGetDocuments } from "@/features/documents/hooks/useGetDocuments";


const Documents = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [documentType, setDocumentType] = useState("all");

  const { data: documents } = useGetDocuments({
    search: search || undefined,
    status: status === "all" ? undefined : status,
    document_type_id:
      documentType === "all" ? undefined : documentType,
  });

  const total = documents?.data?.length ?? 0;
  
  const pending = documents?.data.filter((document) => document.status === "pending").length ?? 0;

  const approved = documents?.data.filter((document) => document.status === "approved").length ?? 0;

  const rejected = documents?.data.filter((document) => document.status === "rejected").length ?? 0;

  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleDocumentClick = (documentId: string) => {
    setSelectedDocumentId(documentId);
    setDetailsOpen(true);
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
            documents={documents?.data ?? []}
            onDocumentClick={handleDocumentClick}
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
            documents={documents?.data ?? []}
            onDocumentClick={handleDocumentClick}
          />
        </div>
      </section>
    </div>
  );
};

export default Documents;