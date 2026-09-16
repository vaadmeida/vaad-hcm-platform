import { useQuery } from "@tanstack/react-query";
import { getDocumentTypes } from "../api/documents.api";

export const useDocumentTypes = () => {
    return useQuery({
        queryKey: ["document-types"],
        queryFn: getDocumentTypes,
        staleTime: 1000 * 60 * 10,
    });
};