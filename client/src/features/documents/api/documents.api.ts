import { api } from "@/lib";
import type { DocsFilters, DocumentDetails, DocumentsResponse, DocumentStatsResponse, DocumentTypesResponse, ExpiringDocumentsResponse, RecentDocumentsResponse } from "../types/documents.types";
import type { ApiResponse } from "@/features/employees/types/employee.types";

export const getDocumentStats = async (): Promise<DocumentStatsResponse> => {
  try {

    await new Promise((resolve) => setTimeout(resolve, 200));

    const response = await api.get<DocumentStatsResponse>("/api/documents/stats");

    return response.data;

  } catch (error) {
    console.error("Document Stats API Error:", error);
    throw error;
  }
};
export const getRecentDocuments = async (): Promise<RecentDocumentsResponse> => {
  try {

    await new Promise((resolve) => setTimeout(resolve, 200));

    const response = await api.get<RecentDocumentsResponse>("/api/documents/recent");

    return response.data;
    

  } catch (error) {
    console.error("Recent Documents API Error:", error);
    throw error;
  }
};


export const getExpiringDocuments = async (): Promise<ExpiringDocumentsResponse> => {
  try {

    await new Promise((resolve) => setTimeout(resolve, 200));
    const response = await api.get<ExpiringDocumentsResponse>("/api/documents/expiring");
    return response.data;

  } catch (error) {
    console.error("Expiring Documents API Error:", error);
    throw error;
  }
};

export const getDocuments = async (filters?: DocsFilters ): Promise<DocumentsResponse> => {
  try {

    await new Promise((resolve) => setTimeout(resolve, 200));
    const response = await api.get<DocumentsResponse>("/api/documents",
      {
        params: filters
      }
    );
    return response.data;

  } catch (error) {
    console.error("Expiring Documents API Error:", error);
    throw error;
  }
};

export const getDocumentById = async (
  id: string
): Promise<ApiResponse<DocumentDetails>> => {
  const response = await api.get(`api/documents/${id}`);

  return response.data;
};



export const getDocumentTypes = async (): Promise<DocumentTypesResponse> => {
    const response = await api.get<DocumentTypesResponse>("/api/documents/types");

    return response.data;
};