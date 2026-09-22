import { Request, Response } from "express";
import { createDocumentTypeSchema, documentIdSchema, employeeDocumentFiltersSchema, employeeIdSchema, getDocumentDownloadSchema, getEmployeeDocumentsQuerySchema, getEmployeeDocumentsSchema, uploadDocumentSchema, verifyDocumentParamsSchema, verifyDocumentSchema } from "./document.validator.ts";
import { createDocumentType, getAllEmployeeDocuments, getDocumentById, getDocumentDownloadUrl, getDocumentsStats, getDocumentTypes, getEmployeeDocuments, getExpiredDocuments, getExpiringDocuments, getMyDocuments, getMyDocumentStats, getRecentDocuments, uploadDocument, verifyDocument } from "./document.service.ts";
import { AppError } from "../../errors/appError.ts";


export const createDocumentTypeController = async (req: Request, res: Response) => {

    const parsed = createDocumentTypeSchema.safeParse(req.body);

    if (!parsed.success) {
        return res.status(400).json({
            message: "Validation Error",
            errors: parsed.error
        });
    }

    const documentType = await createDocumentType(parsed.data);

    return res.status(201).json({
        success: true,
        message: "Document type created successfully",
        data: documentType
    });

};

export const getDocumentTypesController = async (req: Request, res: Response) => {
    const documentTypes = await getDocumentTypes();

    return res.status(200).json({
        success: true,
        message: "Document types retrieved successfully",
        data: documentTypes,
    });
};


export const selfUploadDocumentController = async (
    req: Request,
    res: Response
) => {
    const data = uploadDocumentSchema.parse(req.body);

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Document file is required",
        });
    }

    if (!req.user || !req.user.id) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    const employeeId = req.user.id;
    const uploadedBy = req.user.id;

    const document = await uploadDocument({
        employeeId,
        file: req.file,
        documentTypeId: data.documentTypeId,
        uploadedBy,
    });

    return res.status(201).json({
        success: true,
        message: "Document uploaded successfully",
        data: document,
    });
};

export const uploadEmployeeDocumentController = async (req: Request, res: Response) => {

    const data = uploadDocumentSchema.parse(req.body);

    if (!req.file) {
        return res.status(400).json({
            success: false,
            message: "Document file is required",
        });
    }

    if (!req.user || !req.user.id) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    console.log("UPLOADER ROLE:", req.user.role);

    const employeeId = Array.isArray(req.params.employeeId)
        ? req.params.employeeId[0]
        : req.params.employeeId;

    if (!employeeId) {
        return res.status(400).json({
            success: false,
            message: "Employee ID is required",
        });
    }

    const uploadedBy = req.user.id;
    const document = await uploadDocument({
        employeeId,
        file: req.file,
        documentTypeId: data.documentTypeId,
        uploadedBy,
        uploadedByRole: req.user.role,
    });

    return res.status(201).json({
        success: true,
        message: "Document uploaded successfully",
        data: document,
    });
};


export const getAllEmployeeDocumentsController = async (req: Request, res: Response) => {

    const query = getEmployeeDocumentsQuerySchema.parse(req.query);

    const documents = await getAllEmployeeDocuments(query);

    return res.status(200).json({
        success: true,
        message: "Documents retrieved successfully",
        data: documents,
    });
};

export const getEmployeeDocumentsController = async (
    req: Request,
    res: Response,
) => {
    const { employeeId } = employeeIdSchema.parse(
        req.params,
    );

    const filters = employeeDocumentFiltersSchema.parse(
        req.query,
    );

    const documents = await getEmployeeDocuments(
        employeeId,
        req.user!,
        filters,
    );

    return res.status(200).json({
        success: true,
        message: "Employee documents fetched successfully",
        data: documents,
    });
};

export const getMyDocumentsController = async (
    req: Request,
    res: Response,
) => {
    const filters = employeeDocumentFiltersSchema.parse(
        req.query,
    );

    const documents = await getMyDocuments(
        req.user!,
        filters,
    );

    return res.status(200).json({
        success: true,
        message: "My documents fetched successfully",
        data: documents,
    });
};

export const getDocumentDownloadUrlController = async (req: Request, res: Response) => {
    const { documentId } = getDocumentDownloadSchema.parse(req.params);

    const result = await getDocumentDownloadUrl(
        documentId,
        req.user!
    );

    return res.status(200).json({
        success: true,
        message: "Download URL generated successfully",
        data: result,
    });
}

export const verifyDocumentController = async (req: Request, res: Response) => {

    const { documentId } = verifyDocumentParamsSchema.parse(req.params);

    const { status, notes } = verifyDocumentSchema.parse(req.body);

    const document = await verifyDocument(documentId, status, notes, req.user!);

    return res.status(200).json({
        success: true,
        message: "Document verified successfully",
        data: document,
    });
}

export const getDocumentsStatsController = async (req: Request, res: Response) => {

    const stats = await getDocumentsStats();

    return res.status(200).json({
        success: true,
        message: "Document statistics retrieved successfully",
        data: stats,
    });
}


export const getRecentDocumentsController = async (req: Request, res: Response) => {

    const documents = await getRecentDocuments();

    return res.status(200).json({
        success: true,
        message: "Recent documents retrieved successfully",
        data: documents,
    });

}


export const getExpiringDocumentsController = async (req: Request, res: Response) => {

    const documents = await getExpiringDocuments();

    return res.status(200).json({
        success: true,
        message: "Expiring documents retrieved successfully",
        data: documents,
    });

}
export const getExpiredDocumentsController = async (req: Request, res: Response) => {

    const documents = await getExpiredDocuments();

    return res.status(200).json({
        success: true,
        message: "Expiring documents retrieved successfully",
        data: documents,
    });

}

export const getDocumentByIdController = async (
    req: Request,
    res: Response
) => {
    const { documentId } = documentIdSchema.parse(req.params);

    const document = await getDocumentById(documentId);

    return res.status(200).json({
        success: true,
        message: "Document retrieved successfully",
        data: document,
    });
};


export const getMyDocumentStatsController = async (
    req: Request,
    res: Response,
) => {

    const employeeId = req.user?.id;

    if (typeof employeeId !== "string") {
        throw new Error("Employee ID is required.");
    }

    const stats = await getMyDocumentStats(employeeId);

    return res.status(200).json({
        success: true,
        message: "Document statistics fetched successfully",
        data: stats,
    });
};