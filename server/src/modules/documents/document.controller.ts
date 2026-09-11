import { Request, Response } from "express";
import { createDocumentTypeSchema, getDocumentDownloadSchema, getEmployeeDocumentsSchema, uploadDocumentSchema, verifyDocumentParamsSchema, verifyDocumentSchema } from "./document.validator.ts";
import { createDocumentType, getAllEmployeeDocuments, getDocumentDownloadUrl, getDocumentsStats, getEmployeeDocuments, getExpiringDocuments, getRecentDocuments, uploadDocument, verifyDocument } from "./document.service.ts";


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


export const uploadDocumentController = async (req: Request, res: Response) => {
    //console.log(req.body);
    //console.log(req.file);

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
        uploadedBy
    });


    return res.status(201).json({
        success: true,
        message: "Document uploaded successfully",
        data: document,
    });

}


export const getAllEmployeeDocumentsController = async (req: Request, res: Response) => {

    const documents = await getAllEmployeeDocuments();

    return res.status(200).json({
        success: true,
        message: "Documents retrieved successfully",
        data: documents,
    });
};

export const getEmployeeDocumentsController = async (req: Request, res: Response) => {

    const { employeeId } = getEmployeeDocumentsSchema.parse(req.params);

    const documents = await getEmployeeDocuments(
        employeeId,
        req.user!
    );

    return res.status(200).json({
        success: true,
        message: "Documents retrieved successfully",
        data: documents,
    });
}
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
