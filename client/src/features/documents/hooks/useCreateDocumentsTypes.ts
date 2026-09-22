import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CreateDocumentTypeDto } from "../types/documents.types";
import { createDocumentType } from "../api/documents.api";


export const useCreateDocumentType = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: CreateDocumentTypeDto) =>
            createDocumentType(payload),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ["document-types"],
            });
        },
    });
};