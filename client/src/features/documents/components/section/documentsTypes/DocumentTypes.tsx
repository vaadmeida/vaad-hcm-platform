import DocumentTypesFilters from "./DocumentTypesFilters"
import { useState } from "react";
import { useDocumentTypes } from "@/features/documents/hooks/useDocumentTypes";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import ErrorState from "@/components/common/ErrorState";
import DocumentTypesTable from "./DoumentsTypesTable";
import DocumentsTypesCardList from "./DocumentsTypesCardList";
import AddDocumentDialog from "./AddDocumentDialog";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

const DocumentTypes = () => {

    const [open, setOpen] = useState(false)
    const [search, setSearch] = useState("");
    const [requirement, setRequirement] = useState("all");
    const [status, setStatus] = useState("all");

    const { data: documentTypes = [], isLoading, isError } = useDocumentTypes();

    if (isLoading) {
        return <SkeletonLoader />;
    }

    if (isError) {
        <ErrorState />
    }


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

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
                <DocumentTypesFilters
                    search={search}
                    onSearch={setSearch}
                    requirement={requirement}
                    onRequirementChange={setRequirement}
                    status={status}
                    onStatusChange={setStatus}
                />


                {/* Tablet + Desktop */}
                <div className="hidden md:block">
                    <DocumentTypesTable
                        documentTypes={documentTypes}
                    />
                </div>

                <div className="md:hidden">
                    <DocumentsTypesCardList documentTypes={documentTypes} />
                </div>
            </div>


        </>

    )
}

export default DocumentTypes
