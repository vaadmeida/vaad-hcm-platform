import { useQuery } from "@tanstack/react-query";
import { getDocumentById } from "../api/documents.api";

export const useGetDocumentById = (id: string) => {
  return useQuery({
    queryKey: ["leave-request", id],
    queryFn: () => getDocumentById(id),
    enabled: !!id,
  });
};