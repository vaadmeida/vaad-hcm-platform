import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UpdateDocumentTypeStatusPayload } from "../types/documents.types";
import { updateDocumentTypeStatus } from "../api/documents.api";

// ACTIVATE / DEACTIVATE DOCUMENT TYPE
export const useUpdateDocumentTypeStatus = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (data: UpdateDocumentTypeStatusPayload) =>
            updateDocumentTypeStatus(data),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey:["document-types"],
            });
        },
    });
};