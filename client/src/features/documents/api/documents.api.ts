import { api } from "@/lib";
import type { CreateDocumentTypeDto, DocsFilters, DocumentDetails, DocumentsResponse, DocumentStatsResponse, DocumentType, EmployeeDocument, ExpiringDocumentsResponse, GetDocumentTypesResponse, MyDocument, MyDocumentsResponse, MyDocumentStats, RecentDocumentsResponse, UploadDocumentPayload } from "../types/documents.types";
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

export const getDocuments = async (filters?: DocsFilters): Promise<DocumentsResponse> => {
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

export const uploadEmployeeDocument = async (
  data: UploadDocumentPayload
): Promise<EmployeeDocument> => {
  const formData = new FormData();

  formData.append("file", data.file);
  formData.append("documentTypeId", data.documentTypeId);

  if (data.expiryDate) {
    formData.append("expiry_date", data.expiryDate);
  }

  if (data.notes) {
    formData.append("notes", data.notes);
  }

  const response = await api.post<EmployeeDocument>(
    `/api/documents/employee/${data.employeeId}`,
    formData
  );

  return response.data;
};

export const verifyDocument = async (documentId: string,
  status: "approved" | "rejected",
  notes?: string
) => {
  const response = await api.patch(`/api/documents/verify/${documentId}`, 
    {
      status,
      notes,
    }
  );

  return response.data;
};


export const getDocumentTypes = async (): Promise<DocumentType[]> => {
    const response = await api.get<GetDocumentTypesResponse>(
        "/api/documents/types"
    );

    return response.data.data;
};



export const createDocumentType = async (payload: CreateDocumentTypeDto): Promise<DocumentType> => {
    const response = await api.post("/api/documents", payload);
    return response.data.data;
};

export const getMyDocumentStats = async (): Promise<MyDocumentStats> => {
    const response = await api.get("/api/documents/my/stats");
    return response.data.data;
};

export const getMyDocuments = async(filters?: DocsFilters ): Promise<MyDocument[]> => {
    const response = await api.get<MyDocumentsResponse>("/api/documents/my",
        {
            params: filters,
        },
    );
 
    return response.data.data;
};


export const getEmployeeDocuments = async (employeeId: string): Promise<EmployeeDocument[]> => {
  const response = await api.get<{
    success: boolean;
    message: string;
    data: EmployeeDocument[];
  }>(`/api/documents/employee/${employeeId}`);

  return response.data.data;
};