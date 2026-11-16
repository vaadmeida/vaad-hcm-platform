import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { DeleteDocumentTypePayload } from "../types/documents.types";
import { deleteDocumentType } from "../api/documents.api";
import { DOCUMENT_TYPES_QUERY_KEY } from "./useUpdateDocumentType ";

export const useDeleteDocumentType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: DeleteDocumentTypePayload) =>
            deleteDocumentType(data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: DOCUMENT_TYPES_QUERY_KEY,
            });
        },
    });
};