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


export type DocumentStatus = "pending" | "approved" | "rejected";

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




export interface DocumentDetails {
  id: string;
  employeeId: string;
  employee: {
    name:string
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

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  documentTypeId: string;
  fileName: string;
  fileUrl: string | null;
  fileSizeMb: number;
  expiryDate: string | null;
  notes: string | null;
  uploadedBy: string;
  verifiedBy: string | null;
  verifiedAt: string | null;
  uploadedAt: string;
  updatedAt: string;
  status: DocumentStatus;
  documentType: DocumentType;
  employee?: {
    first_name: string;
    last_name: string;
    email: string;
    avatar_url: string | null;
  };
}

export interface UploadDocumentResponse {
  success: boolean;
  message: string;
  data: EmployeeDocument;
}

export interface UploadDocumentPayload {
  employeeId: string;
  documentTypeId: string;
  file: File;
  expiryDate?: string;
  notes?: string;
}

export type DocumentCategory =
    | "identity"
    | "contract"
    | "compliance"
    | "certificate"
    | "onboarding"
    | "other";

export interface DocumentType {
    id: string;
    name: string;
    category: DocumentCategory;
    description: string | null;
    isRequired: boolean;
    hasExpiry: boolean;
    allowedExtensions: string[];
    maxSizeMb: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateDocumentTypeDto {
    name: string;
    category: DocumentCategory;
    description?: string;
    isRequired?: boolean;
    hasExpiry?: boolean;
}

export interface GetDocumentTypesResponse {
    success: boolean;
    message: string;
    data: DocumentType[];
}


export interface MyDocumentStats {
    total: number;
    approved: number;
    pending: number;
    needsAttention: number;
}

export interface MyDocument {
    id: string;
    employeeId: string;
    fileName: string;
    fileUrl: string | null;
    fileSizeMb: number;
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

export interface MyDocumentsResponse {
    success: boolean;
    message: string;
    data: MyDocument[];
}