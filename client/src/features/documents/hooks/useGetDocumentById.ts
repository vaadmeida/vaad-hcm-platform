import { useQuery } from "@tanstack/react-query";
import { getDocumentById } from "../api/documents.api";

export const useGetDocumentById = (id: string) => {
  return useQuery({
    queryKey: ["employee-document", id],
    queryFn: () => getDocumentById(id),
    enabled: !!id,
  });
};