import { useQuery } from "@tanstack/react-query"
import { getRecentDocuments } from "../api/documents.api"
import type { RecentDocumentsResponse } from "../types/documents.types"

export const useRecentDocuments = () => {
   return useQuery<RecentDocumentsResponse>({
        queryKey: ['recent-documents'],
        queryFn: getRecentDocuments,
        staleTime: 1000 * 60 * 5 // 5 minutes
     })


}