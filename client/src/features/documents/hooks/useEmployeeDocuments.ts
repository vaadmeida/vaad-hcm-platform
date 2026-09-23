import { useQuery } from "@tanstack/react-query";
import { getEmployeeDocuments } from "../api/documents.api";

export const useEmployeeDocuments = (employeeId: string) => {
  return useQuery({
    queryKey: ["employee-documents", employeeId],
    queryFn: () => getEmployeeDocuments(employeeId),
    enabled: !!employeeId,
  });
};