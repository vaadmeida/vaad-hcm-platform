import type { MyDocument } from "@/features/documents/types/documents.types";
import { MoreHorizontal } from "lucide-react";

interface EmployeeDocumentsCardProps {
  document: MyDocument;
  onClick: (documentId: string) => void;
}

const EmployeeDocumentsCard = ({
  document,
  onClick,
}: EmployeeDocumentsCardProps) => {
  const formatDate = (date: string) =>
    new Date(date).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-50 text-green-700";
      case "pending":
        return "bg-amber-50 text-amber-700";
      case "rejected":
        return "bg-red-50 text-red-700";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500";
      case "pending":
        return "bg-amber-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div
      onClick={() => onClick(document.id)}
      className="cursor-pointer rounded-lg border border-border bg-background p-4 transition-colors hover:bg-muted/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-gray-900">
            {document.documentType.name}
          </p>

          <p className="mt-1 truncate text-xs text-muted-foreground">
            {document.fileName}
          </p>
        </div>

        <button
          type="button"
          title="Document actions"
          onClick={(event) => event.stopPropagation()}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
        >
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <div className="mt-4 border-t border-border pt-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-muted-foreground">
            Uploaded {formatDate(document.uploadedAt)}
          </span>

          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${getStatusStyles(
              document.status
            )}`}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${getStatusDot(
                document.status
              )}`}
            />

            {document.status}
          </span>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDocumentsCard;