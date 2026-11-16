
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Power, PowerOff } from "lucide-react";

import type { DocumentType } from "@/features/documents/types/documents.types";
import { toast } from "sonner";
import { useUpdateDocumentTypeStatus } from "@/features/documents/hooks/useUpdateDocumentTypeStatus";

interface DocumentTypeStatusDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    documentType: DocumentType;
}

const DocumentTypeStatusDialog = ({
    open,
    onOpenChange,
    documentType,
}: DocumentTypeStatusDialogProps) => {
    const updateStatus = useUpdateDocumentTypeStatus();

    const isActive = documentType.isActive;
    const newStatus = !isActive;

    const handleSubmit = () => {
        updateStatus.mutate(
            {
                id: documentType.id,
                isActive: newStatus,
            },
            {
                onSuccess: () => {
                    toast.success(
                        `Document type ${newStatus ? "activated" : "deactivated"} successfully.`,
                    );
                    onOpenChange(false);
                },
                onError: (error) => {
                    const message =
                        error instanceof Error
                            ? error.message
                            : "Failed to update document type status.";

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
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                            {isActive ? (
                                <PowerOff className="size-4 text-primary" />
                            ) : (
                                <Power className="size-4 text-primary" />
                            )}
                        </div>

                        <div>
                            <DialogTitle className="text-sm font-semibold">
                                {isActive
                                    ? "Deactivate document type"
                                    : "Activate document type"}
                            </DialogTitle>

                            <DialogDescription className="text-[11px]">
                                Confirm this status change.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Content */}
                <div className="px-4 py-4">
                    <p className="text-xs text-slate-600">
                        Are you sure you want to{" "}
                        <span className="font-semibold text-slate-900">
                            {isActive ? "deactivate" : "activate"}
                        </span>{" "}
                        <span className="font-semibold text-slate-900">
                            {documentType.name}
                        </span>
                        ?
                    </p>

                    <p className="mt-2 text-[11px] text-muted-foreground">
                        {isActive
                            ?"Employees will no longer be able to submit this document type. Existing employee documents will be preserved."
                            : "This document type will become available for employee document submissions again."}
                    </p>
                </div>

                {/* Footer */}
                <DialogFooter className="border-t border-slate-200 bg-slate-50/50 px-6 py-8">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        size="sm"
                        className="h-8 text-xs text-white"
                        disabled={updateStatus.isPending}
                        onClick={handleSubmit}
                    >
                        {updateStatus.isPending
                            ? "Processing..."
                            : isActive
                              ? "Deactivate"
                              : "Activate"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DocumentTypeStatusDialog;
