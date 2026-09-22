import { useQuery } from "@tanstack/react-query";
import { getMyDocumentStats } from "../api/documents.api";


export const useMyDocumentStats = () => {
    return useQuery({
        queryKey: ["my-document-stats"],
        queryFn: getMyDocumentStats,
    });
};