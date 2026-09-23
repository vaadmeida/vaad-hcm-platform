import {
  CheckCircle2,
  Clock3,
  Download,
  Eye,
  FileText,
  XCircle,
} from "lucide-react";

import type { Employee } from "@/features/employees/types/employee.types";
import { useEmployeeDocuments } from "@/features/documents/hooks/useEmployeeDocuments";
import type { EmployeeDocument } from "@/features/documents/types/documents.types";

interface EmployeeDocumentsProps {
  employee: Employee;
}

const EmployeeDocuments = ({
  employee,
}: EmployeeDocumentsProps) => {

  const { data, isLoading, isError } = useEmployeeDocuments(
    employee.id
  );

  const documents = data ?? [];


  const employeeName = `${employee.personal.first_name} ${employee.personal.last_name}`;

  console.log("Employee Documents:", {
    employeeId: employee.id,
    employeeName: `${employee.personal.first_name} ${employee.personal.last_name}`,
    documents,
  });

  const handleViewDocument = (document: EmployeeDocument) => {
    if (!document.fileUrl) return;

    window.open(document.fileUrl, "_blank", "noopener,noreferrer");
  };



  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="h-5 w-40 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted" />
        </div>

        <div className="space-y-3">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-24 animate-pulse rounded-2xl border bg-muted/30"
            />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-70 flex-col items-center justify-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <XCircle className="h-5 w-5 text-red-500" />
        </div>

        <p className="mt-4 text-sm font-semibold">
          Unable to load documents
        </p>

        <p className="mt-1 text-sm text-muted-foreground">
          Please try again later.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-center gap-2">
            <div className="h-5 w-1 rounded-full bg-[#1078A9]" />

            <h2 className="text-lg font-semibold tracking-tight">
              Documents
            </h2>
          </div>

          <p className="mt-1.5 text-sm text-muted-foreground">
            Documents submitted by{" "}
            <span className="font-medium text-foreground">
              {employeeName}
            </span>
          </p>
        </div>

        {documents.length > 0 && (
          <span className="rounded-full bg-[#1078A9]/10 px-3 py-1 text-xs font-medium text-[#1078A9]">
            {documents.length}{" "}
            {documents.length === 1 ? "document" : "documents"}
          </span>
        )}
      </div>

      {/* Empty state */}
      {documents.length === 0 ? (
        <div className="flex min-h-70 flex-col items-center justify-center rounded-2xl border border-dashed">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#1078A9]/10">
            <FileText className="h-6 w-6 text-[#1078A9]" />
          </div>

          <p className="mt-4 text-sm font-semibold">
            No documents uploaded
          </p>

          <p className="mt-1 text-center text-sm text-muted-foreground">
            Documents submitted by this employee will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((document) => {
            const isApproved = document.status === "approved";
            const isPending = document.status === "pending";
            const isRejected = document.status === "rejected";

            return (
              <div
                key={document.id}
                className="group relative flex flex-col gap-4 overflow-hidden rounded-2xl border border-border/70 bg-background p-4 transition-all duration-200 hover:border-[#1078A9]/30 hover:shadow-sm sm:flex-row sm:items-center sm:px-5"
              >
                {/* VAAD accent */}
                <div className="absolute bottom-0 left-0 top-0 w-0.75 bg-[#1078A9]" />

                {/* Document icon */}
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1078A9]/10">
                  <FileText className="h-5 w-5 text-[#1078A9]" />
                </div>

                {/* Document information */}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {document.documentType.name}
                  </p>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                    <span className="max-w-75 truncate">
                      {document.fileName}
                    </span>

                    <span className="hidden text-border sm:inline">
                      •
                    </span>

                    <span>{document.fileSizeMb} MB</span>

                    <span className="hidden text-border sm:inline">
                      •
                    </span>

                    <span>
                      {new Date(
                        document.uploadedAt
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                </div>

                {/* Status */}
                <div className="shrink-0">
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-medium ${isApproved
                      ? "bg-emerald-50 text-emerald-700"
                      : isPending
                        ? "bg-amber-50 text-amber-700"
                        : isRejected
                          ? "bg-red-50 text-red-700"
                          : "bg-muted text-muted-foreground"
                      }`}
                  >
                    {isApproved && (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    )}

                    {isPending && (
                      <Clock3 className="h-3.5 w-3.5" />
                    )}

                    {isRejected && (
                      <XCircle className="h-3.5 w-3.5" />
                    )}

                    {isApproved && "Verified"}
                    {isPending && "Pending"}
                    {isRejected && "Rejected"}
                  </span>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 sm:ml-2">
                  {/* View */}
                  <button
                    type="button"
                    onClick={() => handleViewDocument(document)}
                    disabled={!document.fileUrl}
                    className="flex h-9 items-center gap-2 rounded-lg bg-[#1078A9]/10 px-3 text-xs font-medium text-[#1078A9] transition-colors hover:bg-[#1078A9]/15 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    View
                  </button>

                  {/* Download */}
                  <button
                    type="button"
                    disabled={!document.fileUrl}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
                    aria-label="Download document"
                    title="Download document"
                  >
                    <Download className="h-4 w-4 cursor-pointer" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EmployeeDocuments;