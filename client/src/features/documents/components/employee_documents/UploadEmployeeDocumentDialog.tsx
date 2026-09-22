import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { FileUp, Upload } from "lucide-react";
import { useGetMyProfile } from "@/features/my-profile/hooks/useGetMyProfile";
import ButtonLoader from "@/components/common/ButtonLoader";
import { toast } from "sonner";
import { useDocumentTypes } from "../../hooks/useDocumentTypes";
import { useUploadEmployeeDocument } from "../../hooks/useUploadEmployeeDocuments";

interface UploadEmployeeDocumentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const UploadEmployeeDocumentDialog = ({
    open,
    onOpenChange,
}: UploadEmployeeDocumentDialogProps) => {

    const { data: profile } = useGetMyProfile();

    const { data: documentTypes } = useDocumentTypes();

    console.log(documentTypes);


    const uploadDocumentMutation = useUploadEmployeeDocument();

    const [documentTypeId, setDocumentTypeId] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [expiryDate, setExpiryDate] = useState("");
    const [notes, setNotes] = useState("");

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const file = event.target.files?.[0];

        if (file) {
            setSelectedFile(file);
        }
    };

    const handleUpload = () => {
        if (!profile?.id) {
            toast.error("Unable to identify your employee profile.");
            return;
        }

        if (!documentTypeId || !selectedFile) {
            toast.error("Please select a document type and file.");
            return;
        }

        uploadDocumentMutation.mutate(
            {
                employeeId: profile.id,
                documentTypeId,
                file: selectedFile,
                expiryDate: expiryDate
                    ? new Date(`${expiryDate}T00:00:00.000Z`).toISOString()
                    : undefined,
                notes: notes || undefined,
            },
            {
                onSuccess: () => {
                    toast.success("Document uploaded successfully.");

                    setDocumentTypeId("");
                    setSelectedFile(null);
                    setExpiryDate("");
                    setNotes("");

                    onOpenChange(false);
                },

                onError: (error) => {
                    toast.error(
                        error instanceof Error
                            ? error.message
                            : "Failed to upload document."
                    );
                },
            }
        );
    };

    const isUploading = uploadDocumentMutation.isPending;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100%-2rem)] max-w-lg gap-0 overflow-hidden rounded-xl bg-white p-0 shadow-2xl">
                <DialogHeader className="border-b bg-gray-50/70 px-5 py-4">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <FileUp className="h-4 w-4" />
                        </div>

                        <div>
                            <DialogTitle className="text-base font-semibold text-gray-900">
                                Upload Document
                            </DialogTitle>

                            <DialogDescription className="mt-0.5 text-xs text-gray-500">
                                Upload a document to your personnel record.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                <div className="space-y-4 px-5 py-4">
                    {/* Document Type */}
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="documentType"
                            className="text-xs font-medium text-gray-700"
                        >
                            Document Type
                        </Label>

                        <Select
                            value={documentTypeId}
                            onValueChange={setDocumentTypeId}
                        >
                            <SelectTrigger
                                id="documentType"
                                className="h-10 w-full rounded-lg border-gray-200 bg-white text-sm"
                            >
                                <SelectValue placeholder="Select document type" />
                            </SelectTrigger>

                            <SelectContent>
                                {documentTypes?.map((type) => (
                                    <SelectItem
                                        key={type.id}
                                        value={type.id}
                                    >
                                        {type.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-1.5">
                        <Label
                            htmlFor="file"
                            className="text-xs font-medium text-gray-700"
                        >
                            Document File
                        </Label>

                        <label
                            htmlFor="file"
                            className="group flex h-20 cursor-pointer items-center gap-3 rounded-lg border-2 border-dashed border-gray-200 bg-gray-50/60 px-4 transition hover:border-primary/40 hover:bg-primary/5"
                        >
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm ring-1 ring-gray-100 group-hover:text-primary">
                                <Upload className="h-4 w-4" />
                            </div>

                            <div className="min-w-0 text-left">
                                <p className="truncate text-sm font-medium text-gray-700">
                                    {selectedFile
                                        ? selectedFile.name
                                        : "Click to upload"}
                                </p>

                                <p className="text-xs text-gray-500">
                                    PDF, JPG, JPEG or PNG
                                </p>
                            </div>

                            <Input
                                id="file"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileChange}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Expiry & Notes */}
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1.5">
                            <Label
                                htmlFor="expiryDate"
                                className="text-xs font-medium text-gray-700"
                            >
                                Expiry Date
                            </Label>

                            <Input
                                id="expiryDate"
                                type="date"
                                value={expiryDate}
                                onChange={(event) =>
                                    setExpiryDate(event.target.value)
                                }
                                className="h-10 rounded-lg border-gray-200 text-sm"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label
                                htmlFor="notes"
                                className="text-xs font-medium text-gray-700"
                            >
                                Notes
                            </Label>

                            <Input
                                id="notes"
                                value={notes}
                                onChange={(event) =>
                                    setNotes(event.target.value)
                                }
                                placeholder="Optional note"
                                maxLength={500}
                                className="h-10 rounded-lg border-gray-200 text-sm"
                            />
                        </div>
                    </div>

                    <p className="-mt-1 text-[11px] text-gray-400">
                        Maximum file size depends on the selected document type.
                    </p>
                </div>

                <DialogFooter className="border-t bg-gray-50/50 px-8 py-6">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isUploading}
                        className="h-9 cursor-pointer rounded-lg border-gray-200 bg-white px-4 text-sm"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        onClick={handleUpload}
                        disabled={
                            !profile?.id ||
                            !documentTypeId ||
                            !selectedFile ||
                            isUploading
                        }
                        className="h-9 rounded-lg px-4 text-sm text-white shadow-sm"
                    >
                        <Upload className="mr-2 h-3.5 w-3.5" />
                        {isUploading ? (
                            <ButtonLoader text="Uploading..." />
                        ) : (
                            "Upload Document"
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UploadEmployeeDocumentDialog;