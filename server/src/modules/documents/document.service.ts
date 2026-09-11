import { DocumentCategory } from "@prisma/client";
import { AppError } from "../../errors/appError.ts";
import prisma from "../../config/prisma.ts";
import { getPresignedUrl, uploadFileToS3 } from "../../config/storage.ts";
import { AuthenticatedUser } from "../../middlewares/auth.ts";


interface CreateDocumentTypeDto {
    name: string;
    category: DocumentCategory;
    description?: string;
    isRequired?: boolean;
    hasExpiry?: boolean;
    allowedExtensions?: string[];
    maxSizeMb?: number;
    isActive?: boolean;
}

const VALID_EXTENSIONS = [
    "pdf",
    "jpg",
    "jpeg",
    "png",
    "doc",
    "docx",
];

export const createDocumentType = async (data: CreateDocumentTypeDto) => {

    const existingDocumentType = await prisma.documentType.findUnique({
        where: {
            name: data.name
        }
    });

    if (existingDocumentType) {
        throw new AppError(
            "Duplicate Data",
            409,
            "DOCUMENT_TYPE_ALREADY_EXISTS"
        );
    }

    if (!Object.values(DocumentCategory).includes(data.category)) {
        throw new AppError(
            "Invalid document category",
            400,
            "INVALID_DOCUMENT_CATEGORY"
        );
    }

    const extensions = data.allowedExtensions ?? ["pdf", "jpg", "jpeg", "png"];

    const invalidExtensions = extensions.filter(
        (extension) => !VALID_EXTENSIONS.includes(extension.toLowerCase())
    );

    if (invalidExtensions?.length > 0) {
        throw new AppError(
            `Invalid file extension(s): ${invalidExtensions.join(", ")}`,
            400,
            "INVALID_FILE_EXTENSION"
        );
    }

    if (data.maxSizeMb && data.maxSizeMb <= 0) {
        throw new AppError(
            "Maximum file size must be greater than 0",
            400,
            "INVALID_MAX_FILE_SIZE"
        );
    }
    const documentType = await prisma.documentType.create({
        data: {
            name: data.name,
            category: data.category,
            description: data.description,
            isRequired: data.isRequired,
            hasExpiry: data.hasExpiry,
            allowedExtensions: extensions,
            maxSizeMb: data.maxSizeMb,
            isActive: data.isActive
        }
    });

    return documentType;
}

interface UploadDocumentDto {
    employeeId: string;
    documentTypeId: string;
    file: Express.Multer.File;
    uploadedBy: string;
    allowedExtensions?: string[];
}
export const uploadDocument = async (data: UploadDocumentDto) => {

    // Validate document type
    const documentType = await prisma.documentType.findUnique({
        where: {
            id: data.documentTypeId,
        },
    });

    if (!documentType) {
        throw new AppError(
            "Document type not found",
            404,
            "INVALID_DOCUMENT_TYPE"
        );
    }

    const extensions = data.allowedExtensions ?? ["pdf", "jpg", "jpeg", "png"];

    if (!documentType.allowedExtensions.includes(extensions[0].toLowerCase())) {
        throw new AppError(
            "Invalid file type",
            400,
            "INVALID_FILE_TYPE"
        );
    }

    const fileSizeMb = Math.round(data.file.size / (1024 * 1024));

    if (fileSizeMb > documentType.maxSizeMb) {
        throw new AppError(
            "File too large",
            400,
            "FILE_TOO_LARGE"
        );
    }

    const key = `employees/${data.employeeId}/documents/${data.documentTypeId}/${Date.now()}-${data.file.originalname}`;

    await uploadFileToS3(
        key,
        data.file.buffer,
        data.file.mimetype
    );

    const document = await prisma.employeeDocument.create({
        data: {
            employeeId: data.employeeId,
            documentTypeId: data.documentTypeId,
            fileName: data.file.originalname,
            fileUrl: key,
            fileSizeMb: fileSizeMb,
            uploadedBy: data.uploadedBy,
        },
    });

    return document;

}


export const getAllEmployeeDocuments = async () => {

    const documents = await prisma.employeeDocument.findMany({
        include: {
            documentType: {
                select: {
                    name: true,
                },
            },
            employee: {
                select: {
                    first_name: true,
                    last_name: true,
                    avatar_url: true,
                    department: {
                        select: {
                            name: true,
                        },
                    },
                },
            },
        },
        orderBy: {
            uploadedAt: "desc",
        },
    });


    return Promise.all(
        documents.map(async (document) => ({
            id: document.id,
            employeeId: document.employeeId,
            fileName: document.fileName,
            fileUrl: document.fileUrl
                ? await getPresignedUrl(document.fileUrl)
                : null,
            fileSizeMb: document.fileSizeMb,
            uploadedAt: document.uploadedAt,
            expiryDate: document.expiryDate,
            status: document.status,
            documentType: document.documentType,
            employee: {
                ...document.employee,
                avatar_url: document.employee.avatar_url
                    ? await getPresignedUrl(document.employee.avatar_url)
                    : null,
            },
        }))
    );
};

export const getEmployeeDocuments = async (employeeId: string, requestingUser: AuthenticatedUser) => {

    if (requestingUser.role === 'employee' && requestingUser.id !== employeeId) {
        throw new AppError(
            "You are not authorized to view this employee's documents",
            401,
            "UNAUTHORIZED"
        )
    }

    // If the requesting user is a manager, check if they are the manager of the employee
    if (requestingUser.role === "manager") {

        const employee = await prisma.employee.findUnique({
            where: { id: employeeId },
            select: {
                manager_id: true,
            },
        });

        if (!employee) {
            throw new AppError(
                "Employee not found",
                404,
                "EMPLOYEE_NOT_FOUND"
            );
        }

        if (employee.manager_id !== requestingUser.id) {
            throw new AppError(
                "You are not authorized to view this employee's documents",
                403,
                "UNAUTHORIZED"
            );
        }
    }


    const documents = await prisma.employeeDocument.findMany({
        where: {
            employeeId: employeeId,
        },
        include: {
            documentType: {
                select: {
                    id: true,
                    name: true,
                },
            },
            verifier: {
                select: {
                    first_name: true,
                    last_name: true,
                },
            },
        },
        orderBy: {
            uploadedAt: "desc",
        },
    });

    const now = new Date();
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(now.getDate() + 30)


    const formattedDocuments = documents.map((document) => {
        let expiry_status = 'ok'

        if (document.expiryDate) {
            if (document.expiryDate < now) {
                expiry_status = "expired";
            } else if (document.expiryDate < thirtyDaysFromNow) {
                expiry_status = "expiring_soon";
            }
        }

        return {
            id: document.id,
            employeeId: document.employeeId,
            fileName: document.fileName,
            fileUrl: document.fileUrl,
            fileSizeMb: document.fileSizeMb,
            status: document.status,
            expiryDate: document.expiryDate,
            notes: document.notes,
            uploadedAt: document.uploadedAt,
            // document_type_name: document.documentType.name
            verified_by_name: document.verifier
                ? `${document.verifier.first_name} ${document.verifier.last_name}`
                : null,
            expiry_status,
        };

    })

    return formattedDocuments

}

export const getDocumentDownloadUrl = async (docId: string, requestingUser: AuthenticatedUser) => {

    const document = await prisma.employeeDocument.findUnique({
        where: {
            id: docId,
        }
    });

    if (!document) {
        throw new AppError(
            "Document not found",
            404,
            "DOCUMENT_NOT_FOUND"
        );
    }

    if (requestingUser.role === 'employee' && requestingUser.id !== document.employeeId) {
        throw new AppError(
            "You are not authorized to view this document",
            401,
            "UNAUTHORIZED"
        )
    }

    const url = await getPresignedUrl(document.fileUrl, 900);

    return {
        url,
        expires_in: 900,
    };

}
export const verifyDocument = async (
    documentId: string,
    status: "verified" | "rejected",
    notes: string | undefined,
    requestingUser: AuthenticatedUser

) => {

    if (requestingUser.role !== "admin") {
        throw new AppError(
            "You are not authorized to verify documents",
            401,
            "UNAUTHORIZED"
        );
    }

    const existingDocument = await prisma.employeeDocument.findUnique({
        where: {
            id: documentId,
        },
    });

    if (!existingDocument) {
        throw new AppError(
            "Document not found",
            404,
            "DOCUMENT_NOT_FOUND"
        );
    }

    if (existingDocument.status !== "pending") {
        throw new AppError(
            "Document has already been processed",
            400,
            "DOCUMENT_ALREADY_PROCESSED"
        );
    }


    const document = await prisma.employeeDocument.update({
        where: {
            id: documentId,
        },
        data: {
            status,
            verifiedBy: requestingUser.id,
            verifiedAt: new Date(),
            notes,
        },
    });


    return document;

}


export const getDocumentsStats = async () => {

    const [total, pending, verified, rejected] = await Promise.all([
        prisma.employeeDocument.count(),
        prisma.employeeDocument.count({ where: { status: "pending" } }),
        prisma.employeeDocument.count({ where: { status: "verified" } }),
        prisma.employeeDocument.count({ where: { status: "rejected" } })
    ]);


    return { total, pending, verified, rejected };

}


export const getRecentDocuments = async () => {

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentDocuments = await prisma.employeeDocument.findMany({
        where: {
            uploadedAt: {
                gte: sevenDaysAgo,
            },
        },
        include: {
            employee: {
                select: {
                    first_name: true,
                    last_name: true,
                    avatar_url: true,
                },
            },
        },
        orderBy: {
            uploadedAt: "desc",
        },
    });

    return Promise.all(
        recentDocuments.map(async (doc) => ({
            id: doc.id,
            fileName: doc.fileName,
            uploadedAt: doc.uploadedAt,
            status: doc.status,
            employee: {
                name: `${doc.employee.first_name} ${doc.employee.last_name}`,
                avatar: doc.employee.avatar_url
                    ? await getPresignedUrl(doc.employee.avatar_url)
                    : null,
            },
        }))
    );

}

export const getExpiringDocuments = async () => {
    const today = new Date();

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

    const expiringDocuments = await prisma.employeeDocument.findMany({
        where: {
            expiryDate: {
                gte: today,
                lte: thirtyDaysFromNow,
            },
        },
        include: {
            employee: {
                select: {
                    first_name: true,
                    last_name: true,
                    avatar_url: true,
                },
            },
            documentType: {
                select: {
                    name: true,
                },
            },
        },
        orderBy: {
            expiryDate: "asc",
        },
    });

    return Promise.all(
        expiringDocuments.map(async (doc) => ({
            id: doc.id,
            fileName: doc.fileName,
            expiryDate: doc.expiryDate,
            employee: {
                name: `${doc.employee.first_name} ${doc.employee.last_name}`,
                avatar: doc.employee.avatar_url
                    ? await getPresignedUrl(doc.employee.avatar_url)
                    : null,
            },
            documentType: doc.documentType.name,
        }))
    );
};