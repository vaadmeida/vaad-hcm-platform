import { useState } from "react";

import ErrorState from "@/components/common/ErrorState";
import SkeletonLoader from "@/components/common/SkeletonLoader";

import EmployeeDocumentTable from "@/features/documents/components/employee_documents/EmployeeDocumentTable";
import EmployeeDocumentsFilter from "@/features/documents/components/employee_documents/EmployeeDocumentsFilter";
import EmployeeDocumentsStats from "@/features/documents/components/employee_documents/EmployeeDocumentsStats";
import UploadEmployeeDocumentDialog from "@/features/documents/components/employee_documents/UploadEmployeeDocumentDialog";

import {
  useMyDocuments,
} from "@/features/documents/hooks/useMyDocuments";
import { useMyDocumentStats } from "@/features/documents/hooks/useMyDocumentsStats";
import type { DocsFilters} from "@/features/documents/types/documents.types";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import EmployeeDocumentsCardList from "@/features/documents/components/employee_documents/EmployeeDocumentsCardList";
import EmployeeDocumentsDetails from "@/features/documents/components/employee_documents/EmployeeDocumentsDetails";

const MyDocumentsPage = () => {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);



  const {
    data: stats,
    isLoading: isStatsLoading,
    error: statsError,
  } = useMyDocumentStats();

  const filters: DocsFilters = {
    search: search || undefined,
    status:
      status === "all"
        ? undefined
        : status === "needs_attention"
          ? "rejected"
          : status,
  };

  const {
    data: documents = [],
    isLoading: documentsLoading,
    error: documentsError,
    refetch,
  } = useMyDocuments(filters);

  const handleDocumentClick = (documentId: string) => {
    setSelectedDocumentId(documentId);
    setDetailsOpen(true);
  };


  if (documentsError || statsError) {
    return (
      <ErrorState
        message="Unable to load your documents."
        onRetry={refetch}
      />
    );
  }

  if (documentsLoading || isStatsLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl font-semibold tracking-tight text-gray-900">
              My Documents
            </h1>

            <p className="text-sm text-muted-foreground">
              Keep your employment documents up to date.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setUploadDialogOpen(true)}
            className="h-9 gap-2 rounded-lg px-3 text-sm text-white"
          >
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>

      <EmployeeDocumentsStats />

      <section className="overflow-hidden rounded-lg border border-border bg-white">
        <EmployeeDocumentsFilter
          search={search}
          onSearch={setSearch}
          status={status}
          onStatusChange={setStatus}
          total={stats?.total ?? 0}
          pending={stats?.pending ?? 0}
          approved={stats?.approved ?? 0}
          needsAttention={stats?.needsAttention ?? 0}
        />

        {/* Tablet + Desktop */}
        <div className="hidden md:block">
          <EmployeeDocumentTable
            documents={documents ?? []}
            onDocumentClick={handleDocumentClick}
          />
        </div>

        {/* Mobile */}
        <div className="grid gap-3 md:hidden">
          <EmployeeDocumentsCardList
            documents={documents ?? []}
            onDocumentClick={handleDocumentClick}
          />
        </div>
      </section>


      <EmployeeDocumentsDetails
        documentId={selectedDocumentId}
        open={detailsOpen}
        onClose={() => {
          setDetailsOpen(false);
          setSelectedDocumentId(null);
        }}
      />
      <UploadEmployeeDocumentDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
      />
    </div>
  );
};

export default MyDocumentsPage;