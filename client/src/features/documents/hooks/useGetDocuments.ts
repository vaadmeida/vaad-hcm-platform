import { useQuery } from "@tanstack/react-query"
import type { DocsFilters, DocumentsResponse } from "../types/documents.types"
import { getDocuments } from "../api/documents.api"

export const useGetDocuments = (filters: DocsFilters ) => {
   return useQuery<DocumentsResponse>({
        queryKey: ['documents'],
        queryFn: ()=> getDocuments(filters),
        staleTime: 1000 * 60 * 5
     })

}