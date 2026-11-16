
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

import type { DocumentType } from "@/features/documents/types/documents.types";
import { toast } from "sonner";
import { useDeleteDocumentType } from "@/features/documents/hooks/useDeleteDocumentType";

interface DeleteDocumentTypeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    documentType: DocumentType;
}

const DeleteDocumentTypeDialog = ({
    open,
    onOpenChange,
    documentType,
}: DeleteDocumentTypeDialogProps) => {
    const deleteDocument = useDeleteDocumentType();

    const handleDelete = () => {
        deleteDocument.mutate(
            { id: documentType.id },
            {
                onSuccess: () => {
                    toast.success("Document type deleted successfully.");
                    onOpenChange(false);
                },
                onError: (error) => {
                    const message =
                        error instanceof Error
                            ? error.message
                            : "Failed to delete document type.";

                    toast.error(message);
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-95 gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-xl">
                {/* Header */}
                <DialogHeader className="border-b border-slate-200 px-4 py-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-red-50">
                            <Trash2 className="size-4 text-red-600" />
                        </div>

                        <div>
                            <DialogTitle className="text-sm font-semibold">
                                Delete document type
                            </DialogTitle>

                            <DialogDescription className="text-[11px]">
                                This action cannot be undone.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="px-4 py-4">
                    <p className="text-xs text-slate-600">
                        Are you sure you want to delete{" "}
                        <span className="font-semibold text-slate-900">
                            {documentType.name}
                        </span>
                        ?
                    </p>

                    <p className="mt-2 text-[11px] text-muted-foreground">
                        This document type will be permanently removed. You
                        cannot delete a document type that is linked to
                        existing employee documents.
                    </p>
                </div>

                {/* Footer */}
                <DialogFooter className="border-t border-slate-200 bg-slate-50/50 px-6 py-8 cursor-pointer">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs hover:bg-gray-200 cursor-pointer"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="h-8 text-xs cursor-pointer"
                        disabled={deleteDocument.isPending}
                        onClick={handleDelete}
                    >
                        {deleteDocument.isPending
                            ? "Deleting..."
                            : "Delete document"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeleteDocumentTypeDialog;
