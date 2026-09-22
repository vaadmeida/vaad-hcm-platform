import { DocumentStatus } from "@prisma/client";
import { z } from "zod";

export const createDocumentTypeSchema = z.object({
  name: z.string().trim().min(2, "Document name must be at least 2 characters.").max(150),
  category: z.enum([
    "identity",
    "contract",
    "compliance",
    "certificate",
    "onboarding",
    "other",
  ]),
  description: z.string().trim().max(500).optional(),
  isRequired: z.boolean().optional(),
  hasExpiry: z.boolean().optional(),
  allowedExtensions: z.array(z.enum(["pdf","jpg","jpeg","png","doc","docx",])).optional(),
  maxSizeMb: z.number().int().positive().max(100).optional(),
  isActive: z.boolean().optional(),
});

export const getEmployeeDocumentsQuerySchema = z.object({
    status: z.nativeEnum(DocumentStatus).optional(),
    employee_id: z.string().uuid().optional(),
    search: z.string().trim().optional(),
    document_type_id: z.string().uuid().optional(),
});

export const uploadDocumentSchema = z.object({
  documentTypeId: z.uuid({message: "Invalid document type ID"}),
  expiry_date: z.string().datetime().optional(),
  notes: z.string().max(500, "Notes cannot exceed 500 characters").optional()});

export type UploadDocumentInput = z.infer<typeof uploadDocumentSchema>;

export const getEmployeeDocumentsSchema = z.object({
    employeeId: z.uuid(),
});

export const getDocumentDownloadSchema = z.object({
    documentId: z.uuid(),
});

export const verifyDocumentParamsSchema = z.object({
    documentId: z.uuid(),
});

export const verifyDocumentSchema = z.object({
    status: z.enum(["approved", "rejected"]),
    notes: z.string().optional(),
});

export const documentIdSchema = z.object({
  documentId: z.string().uuid(),
});

export const employeeIdSchema = z.object({
    employeeId: z.string().uuid("Invalid employee ID"),
});

export const employeeDocumentFiltersSchema = z.object({
    search: z.string().trim().optional(),
    status: z.enum(["pending", "approved", "rejected"]).optional(),
    document_type_id: z.string().optional(),
});

export type EmployeeDocumentFilters = z.infer<
    typeof employeeDocumentFiltersSchema
>;