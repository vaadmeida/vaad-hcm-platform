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

export interface DocumentType {
  name: string;
}

export interface DocumentEmployee {
  first_name: string;
  last_name: string;
  avatar_url: string | null;
}



export interface Document {
  id: string;
  employeeId: string;
  fileName: string;
  fileUrl: string;
  fileSizeMb: string;
  uploadedAt: string;
  expiryDate: string | null;
  status: "pending" | "approved" | "rejected";
  documentType: DocumentType;
  employee: DocumentEmployee;
}

export interface DocumentsResponse {
  success: boolean;
  message: string;
  data: Document[];
}

export interface DocsFilters {
  search?: string;
  status?: string;
  document_type_id?: string;
}



export interface DocumentDetailsResponse {
  id: string;
  employeeId: string;
  employee: {
    first_name: string;
    last_name: string;
    avatar_url: string;
    department: string | null;
  };

  fileName: string;
  fileUrl: string;
  fileSizeMb: string;
  status: DocumentStatus;
  expiryDate: string | null;
  notes: string | null;
  uploadedAt: string;

  documentType: {
    id: string;
    name: string;
  };
  verified_by_name: string | null;
  expiry_status: "ok" | "expired" | "expiring_soon";
}