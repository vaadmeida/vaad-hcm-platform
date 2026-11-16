
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FileText } from "lucide-react";
import { useState } from "react";

import type {
    DocumentType,
    DocumentCategory,
} from "@/features/documents/types/documents.types";
import { toast } from "sonner";
import { useUpdateDocumentType } from "@/features/documents/hooks/useUpdateDocumentType ";

interface EditDocumentTypeDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    documentType: DocumentType;
}

const categories = [
    { value: "identity", label: "Identity" },
    { value: "contract", label: "Contract" },
    { value: "compliance", label: "Compliance" },
    { value: "certificate", label: "Certificate" },
    { value: "employment", label: "Employment" },
    { value: "onboarding", label: "Onboarding" },
    { value: "other", label: "Other" },
];

const EditDocumentTypeDialog = ({
    open,
    onOpenChange,
    documentType,
}: EditDocumentTypeDialogProps) => {
    const [name, setName] = useState(documentType.name);
    const [category, setCategory] = useState<DocumentCategory>(
        documentType.category,
    );
    const [description, setDescription] = useState(
        documentType.description ?? "",
    );
    const [isRequired, setIsRequired] = useState(documentType.isRequired);
    const [hasExpiry, setHasExpiry] = useState(documentType.hasExpiry);

    const updateDocumentType = useUpdateDocumentType();

    const handleSubmit = () => {
        if (!name.trim() || !category) return;

        updateDocumentType.mutate(
            {
                id: documentType.id,
                name: name.trim(),
                category,
                description: description.trim() || null,
                isRequired,
                hasExpiry,
            },
            {
                onSuccess: () => {
                    toast.success("Document type updated successfully.");
                    onOpenChange(false);
                },
                onError: (error) => {
                    const message =
                        error instanceof Error
                            ? error.message
                            : "Failed to update document type.";

                    toast.error(message);
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-105 gap-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-0 shadow-xl">
                {/* Header */}
                <DialogHeader className="border-b border-slate-200 px-4 py-3">
                    <div className="flex items-center gap-2.5">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                            <FileText className="size-4 text-primary" />
                        </div>

                        <div className="min-w-0">
                            <DialogTitle className="text-sm font-semibold">
                                Edit document type
                            </DialogTitle>

                            <DialogDescription className="text-[11px]">
                                Update document type information.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Form */}
                <div className="space-y-3 px-4 py-3">
                    {/* Name + Category */}
                    <div className="grid grid-cols-2 gap-2.5">
                        <div className="min-w-0 space-y-1">
                            <label className="text-xs font-medium text-slate-700">
                                Document name
                                <span className="ml-1 text-destructive">*</span>
                            </label>

                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. Passport"
                                className="h-8 border border-slate-200 bg-white text-xs shadow-none focus-visible:border-[#1078A9] focus-visible:ring-1 focus-visible:ring-[#1078A9]/20"
                            />
                        </div>

                        <div className="min-w-0 space-y-1">
                            <label className="text-xs font-medium text-slate-700">
                                Category
                                <span className="ml-1 text-destructive">*</span>
                            </label>

                            <Select
                                value={category}
                                onValueChange={(value) => {
                                    if (
                                        categories.some(
                                            (item) => item.value === value,
                                        )
                                    ) {
                                        setCategory(value as DocumentCategory);
                                    }
                                }}
                            >
                                <SelectTrigger className="h-8 w-full border border-slate-200 bg-white text-xs shadow-none focus:ring-1 focus:ring-[#1078A9]/20">
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>

                                <SelectContent>
                                    {categories.map((item) => (
                                        <SelectItem
                                            key={item.value}
                                            value={item.value}
                                        >
                                            {item.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-1">
                        <label className="text-xs font-medium text-slate-700">
                            Description
                            <span className="ml-1 font-normal text-muted-foreground">
                                (Optional)
                            </span>
                        </label>

                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description..."
                            className="min-h-14 resize-none border border-slate-200 bg-white text-xs shadow-none focus-visible:border-[#1078A9] focus-visible:ring-1 focus-visible:ring-[#1078A9]/20"
                        />
                    </div>

                    {/* Settings */}
                    <div className="divide-y divide-slate-100 rounded-md border border-slate-200">
                        <div className="flex items-center justify-between px-3 py-2">
                            <div>
                                <p className="text-xs font-medium text-slate-700">
                                    Required
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                    Employees must submit this document.
                                </p>
                            </div>

                            <Switch
                                checked={isRequired}
                                onCheckedChange={setIsRequired}
                            />
                        </div>

                        <div className="flex items-center justify-between px-3 py-2">
                            <div>
                                <p className="text-xs font-medium text-slate-700">
                                    Has expiry
                                </p>
                                <p className="text-[10px] text-muted-foreground">
                                    Track document expiration.
                                </p>
                            </div>

                            <Switch
                                checked={hasExpiry}
                                onCheckedChange={setHasExpiry}
                            />
                        </div>
                    </div>
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
                        disabled={
                            !name.trim() ||
                            !category ||
                            updateDocumentType.isPending
                        }
                        onClick={handleSubmit}
                        className="h-8 text-xs text-white"
                    >
                        {updateDocumentType.isPending
                            ? "Saving..."
                            : "Save changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default EditDocumentTypeDialog;
