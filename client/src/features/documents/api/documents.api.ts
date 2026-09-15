import { api } from "@/lib";
import type { DocsFilters, DocumentDetailsResponse, DocumentsResponse, DocumentStatsResponse, ExpiringDocumentsResponse, RecentDocumentsResponse } from "../types/documents.types";

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

    console.log(response.data);

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

export const getDocumentById = async (id: string): Promise< DocumentDetailsResponse> => {
  try {
    const response = await api.get(`api/documents/employee/${id}`);

    return response.data;
  } catch (error) {

    console.error("Getting Documents Details By ID API Error:", error);

    throw error;
  }
};
