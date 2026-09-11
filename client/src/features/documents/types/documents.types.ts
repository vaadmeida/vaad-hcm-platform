export interface DocumentStats {
  total: number;
  pending: number;
  verified: number;
  rejected: number;
}

export interface DocumentStatsResponse {
  success: boolean;
  message: string;
  data: DocumentStats;
}


export type DocumentStatus = "pending" | "verified" | "rejected";

export interface RecentDocumentEmployee {
    name: string;
    avatar: string;
}

export interface RecentDocument {
    id: string;
    fileName: string;
    uploadedAt: string;
    status: DocumentStatus;
    employee: RecentDocumentEmployee;
}

export interface RecentDocumentsResponse {
    success: boolean;
    message: string;
    data: RecentDocument[];
}

export interface ExpiringDocumentEmployee {
  name: string;
  avatar: string;
}

export interface ExpiringDocument {
  id: string;
  fileName: string;
  expiryDate: string;
  employee: ExpiringDocumentEmployee;
}

export interface ExpiringDocumentsResponse {
  success: boolean;
  message: string;
  data: ExpiringDocument[];
}