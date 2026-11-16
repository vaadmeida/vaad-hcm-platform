import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { DocumentType } from "@/features/documents/types/documents.types";
import { MoreHorizontal, Pencil, Power, PowerOff, Trash2 } from "lucide-react";
import { useState } from "react";
import EditDocumentTypeDialog from "./EditDocumentTypesDialog";
import DocumentTypeStatusDialog from "./DocumentTypeStatusDialog";
import DeleteDocumentTypeDialog from "./DeleteDocumentTypeDialog";

interface DocumentTypesTableRowProps {
    documentType: DocumentType;
}

const DocumentTypesTableRow = ({
    documentType,
}: DocumentTypesTableRowProps) => {


    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);


    const requirementStyles = documentType.isRequired
        ? "bg-primary/10 text-primary"
        : "bg-gray-50 text-gray-600";

    const requirementDot = documentType.isRequired
        ? "bg-primary"
        : "bg-gray-400";

    const statusStyles = documentType.isActive
        ? "bg-green-50 text-green-700"
        : "bg-gray-50 text-gray-600";

    const statusDot = documentType.isActive
        ? "bg-green-500"
        : "bg-gray-400";

    return (

        <>
            <tr className="last:border-none hover:bg-gray-50">
                {/* Document Type */}
                <td className="px-3 py-3">
                    <p className="truncate text-sm font-medium text-gray-900">
                        {documentType.name}
                    </p>
                </td>

                {/* Document Category */}
                <td className="hidden px-3 py-3 text-left xl:table-cell">
                    <p className="truncate text-sm font-medium text-gray-900">
                        {documentType.category}
                    </p>
                </td>

                {/* Requirement */}
                <td className="hidden px-3 py-3 text-center xl:table-cell">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${requirementStyles}`}
                    >
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${requirementDot}`}
                        />

                        {documentType.isRequired
                            ? "Required"
                            : "Optional"}
                    </span>
                </td>

                {/* Expiry */}
                <td className="hidden px-3 py-3 xl:table-cell text-center">
                    <span className="text-sm text-gray-700">
                        {documentType.hasExpiry ? "Yes" : "No"}
                    </span>
                </td>

                {/* Status */}
                <td className="px-3 py-3 text-center">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium ${statusStyles}`}
                    >
                        <span
                            className={`h-1.5 w-1.5 rounded-full ${statusDot}`}
                        />

                        {documentType.isActive ? "Active" : "Inactive"}
                    </span>
                </td>

                <td
                    className="px-3 py-2 text-center"
                    onClick={(event) => event.stopPropagation()}
                >
                    <div className="flex justify-center">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button
                                    type="button"
                                    aria-label="Document type actions"
                                    onClick={(event) => event.stopPropagation()}
                                    className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-gray-100 hover:text-gray-900"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </button>
                            </DropdownMenuTrigger>

                            <DropdownMenuContent
                                align="end"
                                className="w-40 bg-white p-1"
                            >
                                <DropdownMenuItem
                                    className="gap-2 px-2 py-1.5 text-xs cursor-pointer"
                                    onSelect={() => setEditDialogOpen(true)}
                                >
                                    <Pencil className="h-3.5 w-3.5" />
                                    Edit
                                </DropdownMenuItem>

                                <DropdownMenuItem
                                    className="gap-2 px-2 py-1.5 text-xs"
                                    onSelect={() => setStatusDialogOpen(true)}
                                >
                                    {documentType.isActive ? (
                                        <>
                                            <PowerOff className="h-3.5 w-3.5" />
                                            Deactivate
                                        </>
                                    ) : (
                                        <>
                                            <Power className="h-3.5 w-3.5" />
                                            Activate
                                        </>
                                    )}
                                </DropdownMenuItem>

                                <DropdownMenuSeparator className="my-1" />

                                <DropdownMenuItem
                                    className="gap-2 px-2 py-1.5 text-xs text-red-600 focus:text-red-600"
                                    onSelect={() => setDeleteDialogOpen(true)}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </td>
            </tr>

            {
                editDialogOpen && (
                    <EditDocumentTypeDialog
                        open={editDialogOpen}
                        onOpenChange={setEditDialogOpen}
                        documentType={documentType}
                    />
                )
            }

            {statusDialogOpen && (
                <DocumentTypeStatusDialog
                    open={statusDialogOpen}
                    onOpenChange={setStatusDialogOpen}
                    documentType={documentType}
                />
            )}

            {deleteDialogOpen && (
                <DeleteDocumentTypeDialog
                    open={deleteDialogOpen}
                    onOpenChange={setDeleteDialogOpen}
                    documentType={documentType}
                />
            )}


        </>



    );
};

export default DocumentTypesTableRow;