import { useMemo, useState } from "react";
import SkeletonLoader from "@/components/common/SkeletonLoader";
import ErrorState from "@/components/common/ErrorState";
import DocumentTypesFilters from "./DocumentTypesFilters";
import DocumentTypesTable from "./DoumentsTypesTable";
import DocumentsTypesCardList from "./DocumentsTypesCardList";
import { useDocumentTypes } from "@/features/documents/hooks/useDocumentsTypes";
import type { DocumentTypeFilters } from "@/features/documents/types/documents.types";

const DocumentTypesContent = () => {
    const [search, setSearch] = useState("");
    const [requirement, setRequirement] = useState("all");
    const [status, setStatus] = useState("all");

    const filters = useMemo<DocumentTypeFilters>(() => ({
        search: search.trim() || undefined,
        requirement:
            requirement === "all" ? undefined : requirement as "required" | "optional",
        status:
            status === "all" ? undefined : status as "active" | "inactive",
    }), [search, requirement, status]);

    const {
        data: documentTypes = [],
        isLoading,
        isError,
    } = useDocumentTypes(filters);

    if (isLoading && documentTypes.length === 0) {
        return <SkeletonLoader />;
    }

    if (isError) {
        return <ErrorState />;
    }

    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            <DocumentTypesFilters
                search={search}
                onSearch={setSearch}
                requirement={requirement}
                onRequirementChange={setRequirement}
                status={status}
                onStatusChange={setStatus}
            />

            <div className="hidden md:block">
                <DocumentTypesTable documentTypes={documentTypes} />
            </div>

            <div className="md:hidden">
                <DocumentsTypesCardList documentTypes={documentTypes} />
            </div>
        </div>
    );
};

export default DocumentTypesContent;