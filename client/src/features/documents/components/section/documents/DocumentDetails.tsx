import { Download, Eye, FileText, Check, Clock, X } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { useGetDocumentById } from "@/features/documents/hooks/useGetDocumentById";

interface DocumentDetailsProps {
  documentId: string | null;
  open: boolean;
  onClose: () => void;
}

const DocumentDetails = ({
  documentId,
  open,
  onClose,
}: DocumentDetailsProps) => {

  const { data, isLoading, isError } = useGetDocumentById(documentId ?? "");

  const document = data?.data;

const employeeName = document?.employee.name ?? "Unknown Employee";

  console.log(employeeName)

  const initials = employeeName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

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
        return "bg-green-50 text-green-700";
      case "rejected":
        return "bg-red-50 text-red-700";
      case "pending":
        return "bg-amber-50 text-amber-700";
      default:
        return "bg-gray-50 text-gray-600";
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

  return (
    <Sheet
      open={open}
      onOpenChange={(value) => !value && onClose()}
    >
      <SheetContent className="flex h-full w-full flex-col border-l border-gray-200 bg-white p-0 sm:max-w-md">
        {/* Header */}
        <SheetHeader className="shrink-0 border-b border-border px-6 py-4">
          <SheetTitle className="text-base font-semibold">
            Document Details
          </SheetTitle>
        </SheetHeader>

        {/* Body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6">
          {isLoading && (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-muted-foreground">
                Loading document...
              </p>
            </div>
          )}

          {isError && (
            <div className="flex items-center justify-center py-16">
              <p className="text-sm text-red-600">
                Failed to load document.
              </p>
            </div>
          )}

          {document && !isLoading && !isError && (
            <div className="space-y-7 py-6">
              {/* Document Summary */}
              <section>
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-[#1078A9]/10 text-[#1078A9]">
                    <FileText className="h-6 w-6" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {document.fileName}
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {document.fileSizeMb} MB
                    </p>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-medium capitalize ${getStatusStyles(
                      document.status
                    )}`}
                  >
                    {document.status}
                  </span>
                </div>
              </section>

              {/* Employee */}
              <section>
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 shrink-0">
                    {document.employee?.avatar_url && (
                      <AvatarImage
                        src={document.employee.avatar_url}
                        alt={employeeName}
                      />
                    )}

                    <AvatarFallback className="bg-[#1078A9]/10 font-medium text-[#1078A9]">
                      {initials}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-gray-900">
                      {employeeName}
                    </p>

                    <p className="truncate text-xs text-muted-foreground">
                      Employee
                    </p>
                  </div>
                </div>
              </section>

              {/* Document Information */}
              <section>
                <h3 className="mb-4 text-sm font-semibold text-gray-900">
                  Document Information
                </h3>

                <div className="grid grid-cols-2 gap-x-5 gap-y-5">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      Document Type
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {document.documentType?.name}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Upload Date
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {formatDate(document.uploadedAt)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      Expiry Date
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {formatDate(document.expiryDate)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-muted-foreground">
                      File Size
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {document.fileSizeMb} MB
                    </p>
                  </div>
                </div>
              </section>

              {/* Status */}
              <section>
                <h3 className="mb-4 text-sm font-semibold text-gray-900">
                  Verification Status
                </h3>

                <div className="flex items-center gap-3 rounded-lg bg-gray-50 px-4 py-3">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${getStatusStyles(
                      document.status
                    )}`}
                  >
                    {getStatusIcon(document.status)}
                  </div>

                  <div>
                    <p className="text-sm font-medium capitalize text-gray-900">
                      {document.status}
                    </p>

                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Document is currently {document.status}
                    </p>
                  </div>
                </div>
              </section>

              {/* Actions */}
              <section className="pb-3">
                <h3 className="mb-3 text-sm font-semibold text-gray-900">
                  File
                </h3>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md border border-border bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4" />
                    Preview
                  </button>

                  <button
                    type="button"
                    onClick={handleDownload}
                    className="flex flex-1 items-center justify-center gap-2 rounded-md bg-[#1078A9] px-4 py-2.5 text-sm font-medium text-white transition hover:bg-[#0d668f]"
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </button>
                </div>
              </section>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default DocumentDetails;