import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateDocumentTypePayload } from "../types/documents.types";
import { updateDocumentType } from "../api/documents.api";

export const DOCUMENT_TYPES_QUERY_KEY = ["document-types"];

export const useUpdateDocumentType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateDocumentTypePayload) =>
            updateDocumentType(data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: DOCUMENT_TYPES_QUERY_KEY,
            });
        },
    });
};