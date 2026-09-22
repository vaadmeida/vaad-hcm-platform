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
import { useCreateDocumentType } from "@/features/documents/hooks/useCreateDocumentsTypes";
import type { DocumentCategory } from "@/features/documents/types/documents.types";
import { toast } from "sonner";

interface AddDocumentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const categories = [
    { value: "identity", label: "Identity" },
    { value: "contract", label: "Contract" },
    { value: "compliance", label: "Compliance" },
    { value: "certificate", label: "Certificate" },
    { value: "onboarding", label: "Onboarding" },
    { value: "other", label: "Other" },
];

const AddDocumentDialog = ({
    open,
    onOpenChange,
}: AddDocumentDialogProps) => {

    const [name, setName] = useState("");
    const [category, setCategory] = useState<DocumentCategory | "">("");
    const [description, setDescription] = useState("");
    const [isRequired, setIsRequired] = useState(false);
    const [hasExpiry, setHasExpiry] = useState(false);

    const createDocumentType = useCreateDocumentType();

    const handleSubmit = () => {
        if (!name.trim() || !category) return;

        createDocumentType.mutate(
            {
                name: name.trim(),
                category,
                description: description.trim() || undefined,
                isRequired,
                hasExpiry,
            },
            {
                onSuccess: () => {
                    toast.success("Document type created successfully.");

                    setName("");
                    setCategory("");
                    setDescription("");
                    setIsRequired(false);
                    setHasExpiry(false);

                    onOpenChange(false);
                },

                onError: (error) => {
                    const message =
                        error instanceof Error
                            ? error.message
                            : "Failed to create document type.";

                    toast.error(message);
                },
            },
        );
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-110 gap-0 overflow-hidden p-0 bg-white">
                {/* Header */}
                <DialogHeader className="border-b px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex size-8 shrink-0 items-center justify-center rounded-md bg-primary/10">
                            <FileText className="size-4 text-primary" />
                        </div>

                        <div className="min-w-0">
                            <DialogTitle className="text-sm font-semibold">
                                Add document type
                            </DialogTitle>

                            <DialogDescription className="mt-0.5 text-xs">
                                Define a document for employee records.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Form */}
                <div className="space-y-4 px-5 py-4">
                    {/* Name + Category */}
                    <div className="grid grid-cols-2 gap-3">
                        {/* Document Name */}
                        <div className="min-w-0 space-y-1.5">
                            <label className="text-xs font-medium">
                                Document name
                                <span className="ml-1 text-destructive">
                                    *
                                </span>
                            </label>

                            <Input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="e.g. International Passport"
                                className="h-8 w-full text-sm"
                            />
                        </div>

                        {/* Category */}
                        <div className="min-w-0 space-y-1.5">
                            <label className="text-xs font-medium">
                                Category
                                <span className="ml-1 text-destructive">
                                    *
                                </span>
                            </label>
                            <Select
                                value={category}
                                onValueChange={(value) => {
                                    if (categories.some((item) => item.value === value)) {
                                        setCategory(value as DocumentCategory);
                                    }
                                }}
                            >
                                <SelectTrigger className="h-8 w-full text-sm">
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
                    <div className="space-y-1.5">
                        <label className="text-xs font-medium">
                            Description
                            <span className="ml-1 font-normal text-muted-foreground">
                                Optional
                            </span>
                        </label>

                        <Textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Brief description..."
                            className="min-h-15 resize-none text-sm"
                        />
                    </div>

                    {/* Settings */}
                    <div className="rounded-md border">
                        {/* Required */}
                        <div className="flex items-center justify-between px-3 py-2.5">
                            <div>
                                <p className="text-xs font-medium">
                                    Required
                                </p>

                                <p className="text-[11px] text-muted-foreground">
                                    Employees must submit this document.
                                </p>
                            </div>

                            <Switch
                                checked={isRequired}
                                onCheckedChange={setIsRequired}
                            />
                        </div>

                        <div className="border-t" />

                        {/* Has Expiry */}
                        <div className="flex items-center justify-between px-3 py-2.5">
                            <div>
                                <p className="text-xs font-medium">
                                    Has expiry
                                </p>

                                <p className="text-[11px] text-muted-foreground">
                                    Track the document's expiration date.
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
                <DialogFooter className="border-t px-8 py-6">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        size="sm"
                        disabled={!name.trim() || !category}
                        onClick={handleSubmit}
                        className="text-white"
                    >
                        Add document
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddDocumentDialog;