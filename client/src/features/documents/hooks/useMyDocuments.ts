import { useQuery } from "@tanstack/react-query";
import { getMyDocuments } from "../api/documents.api";
import type { DocsFilters } from "../types/documents.types";


export const useMyDocuments = (filters?: DocsFilters) => {
    return useQuery({
        queryKey: ["my-documents", filters],
        queryFn: () => getMyDocuments(filters),
    });
};