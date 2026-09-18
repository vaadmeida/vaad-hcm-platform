import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { UploadDocumentPayload } from "../types/documents.types";
import { uploadEmployeeDocument } from "../api/documents.api";


export const useUploadEmployeeDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UploadDocumentPayload) =>
      uploadEmployeeDocument(data),

    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["employee-documents", variables.employeeId],
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