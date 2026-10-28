import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMyDocument } from "@/features/documents/api/documents.api";

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMyDocument,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["my-documents"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["documents-stats"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["documents"],
        }),
      ]);
    },
  });
};

export default useDeleteDocument;