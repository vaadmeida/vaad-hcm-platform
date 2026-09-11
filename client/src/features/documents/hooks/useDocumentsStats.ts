import { useQuery } from "@tanstack/react-query"
import type { DocumentStatsResponse } from "../types/documents.types"
import { getDocumentStats } from "../api/documents.api"


export const useDocumentStats = () => {
   return useQuery<DocumentStatsResponse>({
        queryKey: ['documents-stats'],
        queryFn: getDocumentStats,
        staleTime: 1000 * 60 * 5 // 5 minutes
     })


}