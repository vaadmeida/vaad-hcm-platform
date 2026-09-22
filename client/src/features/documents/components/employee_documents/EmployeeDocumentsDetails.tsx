
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Button } from "@/components/ui/button";

import { useGetDocumentById } from "@/features/documents/hooks/useGetDocumentById";
import { CalendarDays, Check, Clock, Download, Eye, FileText, HardDrive, MessageSquareText, ShieldCheck, X } from "lucide-react";

interface EmployeeDocumentsDetailsProps {
  documentId: string | null;
  open: boolean;
  onClose: () => void;
}

const EmployeeDocumentsDetails = ({
  documentId,
  open,
  onClose,
}: EmployeeDocumentsDetailsProps) => {
  const { data, isLoading, isError } = useGetDocumentById(documentId ?? "");

  const document = data?.data;

  const formatDate = (date?: string | null) => {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusStyles = (status?: string) => {
    switch (status) {
      case "approved":
        return {
          wrapper: "border-emerald-100 bg-emerald-50 text-emerald-700",
          icon: "bg-emerald-100 text-emerald-700",
        };

      case "rejected":
        return {
          wrapper: "border-red-100 bg-red-50 text-red-700",
          icon: "bg-red-100 text-red-700",
        };

      case "pending":
        return {
          wrapper: "border-amber-100 bg-amber-50 text-amber-700",
          icon: "bg-amber-100 text-amber-700",
        };

      default:
        return {
          wrapper: "border-gray-100 bg-gray-50 text-gray-600",
          icon: "bg-gray-100 text-gray-600",
        };
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case "approved":
        return <Check className="h-4 w-4" />;

      case "rejected":
        return <X className="h-4 w-4" />;

      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const handleDownload = () => {
    if (!document?.fileUrl) return;

    window.open(document.fileUrl, "_blank", "noopener,noreferrer");
  };

  const handlePreview = () => {
    if (!document?.fileUrl) return;

    window.open(document.fileUrl, "_blank", "noopener,noreferrer");
  };

  const statusStyles = getStatusStyles(document?.status);

  return (
    <Sheet open={open} onOpenChange={(value) => !value && onClose()}>
      <SheetContent className="flex h-full w-full flex-col border-l border-gray-200 bg-background p-0 sm:max-w-md">
        {/* Header */}
        <SheetHeader className="shrink-0 border-b border-gray-200 bg-white px-6 py-5">
          <SheetTitle className="text-lg font-semibold tracking-tight text-gray-900">
            Document Details
          </SheetTitle>

          <p className="mt-1 text-xs text-gray-500">
            View your uploaded document and verification status
          </p>
        </SheetHeader>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="mb-3 h-7 w-7 animate-spin rounded-full border-2 border-gray-200 border-t-[#1078A9]" />

              <p className="text-sm font-medium text-gray-600">
                Loading document...
              </p>
            </div>
          )}

          {isError && (
            <div className="mx-5 mt-5 rounded-xl border border-red-100 bg-red-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
                  <X className="h-4 w-4" />
                </div>

                <div>
                  <p className="text-sm font-semibold text-red-800">
                    Unable to load document
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-600">
                    Something went wrong while fetching this document.
                  </p>
                </div>
              </div>
            </div>
          )}

          {document && !isLoading && !isError && (
            <div className="space-y-4 p-5">
              {/* Document Summary */}
              <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#1078A9]/10 text-[#1078A9]">
                    <FileText className="h-6 w-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p
                      title={document.fileName}
                      className="truncate text-sm font-semibold text-gray-900"
                    >
                      {document.fileName}
                    </p>

                    <p className="mt-1 truncate text-xs text-gray-500">
                      {document.documentType?.name || "Document"}
                    </p>

                    <div className="mt-2 flex items-center gap-1.5 text-xs text-gray-400">
                      <HardDrive className="h-3.5 w-3.5" />
                      {document.fileSizeMb} MB
                    </div>
                  </div>

                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize ${statusStyles.wrapper}`}
                  >
                    {getStatusIcon(document.status)}
                    {document.status}
                  </span>
                </div>
              </section>

              {/* Document Information */}
              <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <h3 className="mb-4 text-sm font-semibold text-gray-900">
                  Document Information
                </h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex gap-2.5">
                    <FileText className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                    <div className="min-w-0">
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Type
                      </p>

                      <p className="mt-1 truncate text-sm font-medium text-gray-900">
                        {document.documentType?.name || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2.5">
                    <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Uploaded
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {formatDate(document.uploadedAt)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2.5">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        Expiry
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {formatDate(document.expiryDate)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2.5">
                    <HardDrive className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" />

                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                        File Size
                      </p>

                      <p className="mt-1 text-sm font-medium text-gray-900">
                        {document.fileSizeMb} MB
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Notes */}
              <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <MessageSquareText className="h-4 w-4 text-gray-400" />

                  <h3 className="text-sm font-semibold text-gray-900">
                    Notes
                  </h3>
                </div>

                <div className="rounded-lg border border-gray-100 bg-gray-50 px-3.5 py-3">
                  <p className="text-sm leading-5 text-gray-600">
                    {document.notes || "No notes added to this document."}
                  </p>
                </div>
              </section>

              {/* Verification */}
              <section className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-gray-400" />

                  <h3 className="text-sm font-semibold text-gray-900">
                    Verification
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${statusStyles.icon}`}
                  >
                    {getStatusIcon(document.status)}
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold capitalize text-gray-900">
                      {document.status === "approved"
                        ? "Verified"
                        : document.status}
                    </p>

                    <p className="mt-0.5 text-xs leading-5 text-gray-500">
                      {document.status === "pending"
                        ? "This document is waiting for HR review."
                        : document.status === "approved"
                          ? "Your document has been verified by HR."
                          : "Your document was rejected. Please review the notes and upload an updated document if required."}
                    </p>
                  </div>
                </div>
              </section>

              {/* File Actions */}
              <section className="pb-2">
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePreview}
                    disabled={!document.fileUrl}
                    className="h-10 border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>

                  <Button
                    type="button"
                    onClick={handleDownload}
                    disabled={!document.fileUrl}
                    className="h-10 bg-[#1078A9] text-white shadow-sm hover:bg-[#0d668f]"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </section>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EmployeeDocumentsDetails;