import { useState } from "react";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import AddDocumentDialog from "./AddDocumentDialog";
import DocumentTypesContent from "./DocumentTypesContent";

const DocumentTypes = () => {
    const [open, setOpen] = useState(false);

    return (
        <>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-semibold tracking-tight text-gray-900">
                        Document Types
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage the types of documents employees can upload.
                    </p>
                </div>

                <Button
                    onClick={() => setOpen(true)}
                    className="h-9 gap-2 rounded-lg px-3 text-sm text-white"
                >
                    <PlusIcon />
                    Add Document Type
                </Button>

                <AddDocumentDialog
                    open={open}
                    onOpenChange={setOpen}
                />
            </div>

            <DocumentTypesContent />
        </>
    );
};

export default DocumentTypes;