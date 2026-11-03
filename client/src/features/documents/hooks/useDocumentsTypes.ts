import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { getDocumentTypes } from "../api/documents.api";
import type {
    DocumentType,
    DocumentTypeFilters,
} from "../types/documents.types";

export const useDocumentTypes = (
    filters?: DocumentTypeFilters
): UseQueryResult<DocumentType[], Error> => {
    return useQuery<DocumentType[], Error>({
        queryKey: ["document-types", filters],
        queryFn: () => getDocumentTypes(filters),
        placeholderData: (previousData) => previousData,
        staleTime: 1000 * 60 * 5,
    });
};