import { useQuery } from "@tanstack/react-query"
import { getExpiringDocuments } from "../api/documents.api"
import type { ExpiringDocumentsResponse } from "../types/documents.types"
export const useExpiringDocuments = () => {
   return useQuery<ExpiringDocumentsResponse>({
        queryKey: ['expiring-documents'],
        queryFn: getExpiringDocuments,
        staleTime: 1000 * 60 * 5 // 5 minutes
     })


}