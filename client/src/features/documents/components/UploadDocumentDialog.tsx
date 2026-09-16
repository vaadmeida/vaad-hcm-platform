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
import { useEmployee } from "@/features/employees/hooks/useEmployee";
import { useDocumentTypes } from "../hooks/useDocumentTypes";

interface UploadDocumentDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const UploadDocumentDialog = ({
    open,
    onOpenChange,
}: UploadDocumentDialogProps) => {



    const { data: employees } = useEmployee({})
    const { data: documentTypes } = useDocumentTypes();


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[calc(100%-2rem)] max-w-xl gap-0 overflow-hidden rounded-2xl bg-white p-0 shadow-2xl">
                {/* Header */}
                <DialogHeader className="border-b bg-gray-50/70 px-6 py-5">
                    <div className="flex items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                            <FileUp className="h-5 w-5" />
                        </div>

                        <div className="space-y-1">
                            <DialogTitle className="text-lg font-semibold text-gray-900">
                                Upload Document
                            </DialogTitle>

                            <DialogDescription className="text-sm leading-5 text-gray-500">
                                Add an employee document to their personnel record.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {/* Form */}
                <div className="space-y-6 px-6 py-6">
                    {/* Employee & Document Type */}
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                        {/* Employee */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="employee"
                                className="text-sm font-medium text-gray-700"
                            >
                                Employee
                            </Label>
                            <Select>
                                <SelectTrigger
                                    id="employee"
                                    className="h-11 w-full rounded-lg border-gray-200 bg-white px-3.5 text-sm shadow-sm cursor-pointer"
                                >
                                    <SelectValue placeholder="Select employee" />
                                </SelectTrigger>

                                <SelectContent>
                                    {employees?.data.map((employee) => (
                                        <SelectItem key={employee.id} value={employee.id}>
                                            {employee.first_name} {employee.last_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Document Type */}
                        <div className="space-y-2">
                            <Label
                                htmlFor="documentType"
                                className="text-sm font-medium text-gray-700"
                            >
                                Document Type
                            </Label>

                            <Select>
                                <SelectTrigger
                                    id="documentType"
                                    className="h-11 w-full rounded-lg border-gray-200 bg-white px-3.5 text-sm shadow-sm transition focus:ring-2 focus:ring-primary/20 cursor-pointer"
                                >
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>

                                <SelectContent className="cursor-pointer">
                                    {documentTypes?.data.map((type) => (
                                        <SelectItem key={type.id} value={type.id}>
                                            {type.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* File Upload */}
                    <div className="space-y-2">
                        <Label
                            htmlFor="file"
                            className="text-sm font-medium text-gray-700"
                        >
                            Document File
                        </Label>

                        <label
                            htmlFor="file"
                            className="group flex h-28 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50/60 px-6 text-center transition hover:border-primary/40 hover:bg-primary/2"
                        >
                            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-400 shadow-sm ring-1 ring-gray-100 transition group-hover:text-primary">
                                <Upload className="h-4 w-4" />
                            </div>

                            <p className="text-sm font-medium text-gray-700">
                                Click to upload
                            </p>

                            <p className="mt-0.5 text-xs text-gray-500">
                                PDF, JPG, JPEG or PNG
                            </p>

                            <Input
                                id="file"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                className="hidden"
                            />
                        </label>

                        <p className="text-xs text-gray-400">
                            Maximum file size depends on the selected document type.
                        </p>
                    </div>
                </div>

                {/* Footer */}
                <DialogFooter className="border-t bg-gray-50/50 px-8 py-5">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        className="h-10 rounded-lg border-gray-200 bg-white px-5"
                    >
                        Cancel
                    </Button>

                    <Button
                        type="button"
                        className="h-10 rounded-lg px-5 text-white shadow-sm transition hover:bg-primary/90"
                    >
                        <Upload className="mr-2 h-4 w-4" />
                        Upload Document
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UploadDocumentDialog;