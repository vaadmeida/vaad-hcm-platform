import {
  Avatar,
  AvatarFallback,
} from "@/components/ui/avatar";
import type { Document } from "@/features/documents/types/documents.types";
import { MoreHorizontal } from "lucide-react";

interface DocumentTableRowProps {
  document: Document;
  onClick: (documentId: string) => void;
}

const DocumentTableRow = ({
  document,
  onClick,
}: DocumentTableRowProps) => {
  const employeeName = document?.employee
    ? `${document.employee.first_name} ${document.employee.last_name}`
    : "Unknown Employee";

  const initials = employeeName
    .split(" ")
    .map((name) => name.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

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

  return (
    <tr
      onClick={() => onClick(document.id)}
      className="cursor-pointer last:border-none hover:bg-gray-50"
    >
      {/* Employee */}
      <td className="px-3 py-3">
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-[#1078A9]/10 text-xs font-medium text-[#1078A9]">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-gray-900">
              {employeeName}
            </p>
          </div>
        </div>
      </td>

      {/* Document */}
      <td className="hidden px-3 py-3 xl:table-cell">
        <span className="font-medium text-gray-900">
          {document.fileName}
        </span>
      </td>

      {/* Document Type */}
      <td className="px-3 py-3">
        <span className="text-sm text-gray-700">
          {document.documentType.name}
        </span>
      </td>

      {/* Uploaded Date */}
      <td className="px-3 py-3">
        <span className="whitespace-nowrap text-sm">
          {formatDate(document.uploadedAt)}
        </span>
      </td>

      {/* Status */}
      <td className="hidden px-3 py-3 xl:table-cell">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium capitalize ${getStatusStyles(
            document.status
          )}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              document.status === "approved"
                ? "bg-green-500"
                : document.status === "pending"
                  ? "bg-amber-500"
                  : document.status === "rejected"
                    ? "bg-red-500"
                    : "bg-gray-400"
            }`}
          />

          {document.status}
        </span>
      </td>

      {/* Actions */}
      <td className="px-3 py-3 text-center">
        <div className="flex justify-center">
          <span
            title="Document actions"
            className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground"
          >
            <MoreHorizontal className="h-4 w-4 lg:ml-6 xl:ml-5" />
          </span>
        </div>
      </td>
    </tr>
  );
};

export default DocumentTableRow;