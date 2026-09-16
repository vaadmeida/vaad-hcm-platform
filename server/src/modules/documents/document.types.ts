import { DocumentCategory } from "@prisma/client";

export interface CreateDocumentTypeDto {
    name: string;
    category: DocumentCategory;
    description?: string;
    isRequired?: boolean;
    hasExpiry?: boolean;
    allowedExtensions?: string[];
    maxSizeMb?: number;
    isActive?: boolean;
}


export interface UploadDocumentDto {
    employeeId: string;
    documentTypeId: string;
    file: Express.Multer.File;
    uploadedBy: string;
    allowedExtensions?: string[];
}


export interface GetEmployeeDocumentsInput {
    status?: string;
    employee_id?: string;
    search?: string;
    document_type_id?: string;
}
