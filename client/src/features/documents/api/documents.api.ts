import { api } from "@/lib";
import type { DocumentStatsResponse, ExpiringDocumentsResponse, RecentDocumentsResponse } from "../types/documents.types";

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
    console.error("Recent Documents API Error:", error);
    throw error;
  }
};
