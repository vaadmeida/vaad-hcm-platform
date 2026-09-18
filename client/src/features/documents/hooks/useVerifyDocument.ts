import { useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyDocument } from "../api/documents.api";


export const useVerifyDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            documentId,
            status,
            notes,
        }: {
            documentId: string;
            status: "approved" | "rejected";
            notes?: string;
        }) => verifyDocument(documentId, status, notes),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: ["document", variables.documentId],
            });

            queryClient.invalidateQueries({
                queryKey: ["documents"],
            });

            queryClient.invalidateQueries({
                queryKey: ["documents-stats"],
            });

            queryClient.invalidateQueries({
                queryKey: ["recent-documents"],
            });
        },
    });
};