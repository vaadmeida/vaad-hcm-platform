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
import { FileText } from "lucide-react";

interface AddDocumentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const AddDocumentDialog = ({
    open,
    onOpenChange,
}: AddDocumentDialogProps) => {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md gap-0 overflow-hidden p-0 bg-white">
                {/* Header */}
                <DialogHeader className="border-b border-border px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                            <FileText className="h-4 w-4 text-primary" />
                        </div>

                        <div>
                            <DialogTitle className="text-base font-semibold text-gray-900">
                                Add Document Type
                            </DialogTitle>

                            <DialogDescription className="mt-0.5 text-xs">
                                Create a document type for employee records.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Form */}
                <div className="space-y-4 px-5 py-5">
                    {/* Document Name */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="document-name"
                            className="text-sm font-medium text-gray-900"
                        >
                            Document Name
                            <span className="ml-1 text-red-500">*</span>
                        </label>

                        <Input
                            id="document-name"
                            placeholder="e.g. International Passport"
                            className="h-9"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-1.5">
                        <label
                            htmlFor="document-description"
                            className="text-sm font-medium text-gray-900"
                        >
                            Description
                        </label>

                        <Textarea
                            id="document-description"
                            placeholder="Brief description of the document..."
                            className="min-h-20 resize-none"
                        />
                    </div>

                    {/* Settings */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-900">
                            Document Settings
                        </p>

                        <div className="divide-y rounded-lg border border-border">
                            <div className="flex items-center justify-between px-3.5 py-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Required
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Employees must provide this document.
                                    </p>
                                </div>

                                <Switch />
                            </div>

                            <div className="flex items-center justify-between px-3.5 py-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Has expiry
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        Document has an expiration date.
                                    </p>
                                </div>

                                <Switch />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="border-t border-border px-8 py-6">
                    <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>

                    <Button type="button" size="sm" className="text-white">
                        Add Document Type
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default AddDocumentDialog;