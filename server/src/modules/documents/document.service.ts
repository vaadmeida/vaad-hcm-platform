import path from "path";
import { DocumentCategory, DocumentStatus } from "@prisma/client";
import { AppError } from "../../errors/appError.ts";
import prisma from "../../config/prisma.ts";
import { getPresignedUrl, uploadFileToS3 } from "../../config/storage.ts";
import { AuthenticatedUser } from "../../middlewares/auth.ts";
import { CreateDocumentTypeDto, GetEmployeeDocumentsInput, UploadDocumentDto } from "./document.types.ts";



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


export const getDocumentTypes = async () => {
    const documentTypes = await prisma.documentType.findMany({
        select: {
            id: true,
            name: true,
        },
        where: {
            isActive: true,
        },
        orderBy: {
            name: "asc",
        },
    });

    return documentTypes;
};



export const uploadDocument = async (data: UploadDocumentDto) => {
    // 1. Validate document type
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

    // 2. Get actual file extension
    const extension = path.extname(data.file.originalname).replace(".", "").toLowerCase();

    // 3. Validate file extension
    if (!documentType.allowedExtensions.includes(extension)) {
        throw new AppError(
            "Invalid file type",
            400,
            "INVALID_FILE_TYPE"
        );
    }

    // 4. Validate file size
    const fileSizeMb = Math.round(data.file.size / (1024 * 1024));

    if (fileSizeMb > documentType.maxSizeMb) {
        throw new AppError(
            "File too large",
            400,
            "FILE_TOO_LARGE"
        );
    }

    // 5. Create S3 key
    const key = `employees/${data.employeeId}/documents/${data.documentTypeId}/${Date.now()}-${data.file.originalname}`;

    // 6. Upload file to S3
    await uploadFileToS3(
        key,
        data.file.buffer,
        data.file.mimetype
    );

    const isHrOrAdmin = data.uploadedByRole === "hr" || data.uploadedByRole === "admin";

    const document = await prisma.employeeDocument.create({
        data: {
            employeeId: data.employeeId,
            documentTypeId: data.documentTypeId,
            fileName: data.file.originalname,
            fileUrl: key,
            fileSizeMb,
            uploadedBy: data.uploadedBy,
            status: isHrOrAdmin ? "approved" : "pending",
            verifiedBy: isHrOrAdmin ? data.uploadedBy : null,
            verifiedAt: isHrOrAdmin ? new Date() : null,
        },
    });

    return document;
};

export const getAllEmployeeDocuments = async ({
    status,
    employee_id,
    search,
    document_type_id
}: GetEmployeeDocumentsInput) => {



    const documents = await prisma.employeeDocument.findMany({
        where: {
            ...(status && {
                status: status as DocumentStatus,
            }),
            ...(employee_id && {
                employeeId: employee_id,
            }),
            ...(document_type_id && {
                documentTypeId: document_type_id,
            }),
            ...(search && {
                OR: [
                    {
                        fileName: {
                            contains: search,
                            mode: "insensitive",
                        },
                    },
                    {
                        employee: {
                            first_name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                    {
                        employee: {
                            last_name: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                    {
                        employee: {
                            email: {
                                contains: search,
                                mode: "insensitive",
                            },
                        },
                    },
                ],
            }),
        },

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
                    email: true,
                    avatar_url: true,
                },
            },
        },

        orderBy: {
            uploadedAt: "desc",
        },
    });



    return Promise.all(
        documents.map(async (document) => {
            const fileUrl = document.fileUrl?.startsWith("http")
                ? document.fileUrl
                : document.fileUrl
                    ? await getPresignedUrl(document.fileUrl)
                    : null;
            return {
                id: document.id,
                employeeId: document.employeeId,
                fileName: document.fileName,
                fileUrl,
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
            };
        })
    );
};

export const getEmployeeDocuments = async (
    employeeId: string,
    requestingUser: AuthenticatedUser
) => {
    if (
        requestingUser.role === "employee" &&
        requestingUser.id !== employeeId
    ) {
        throw new AppError(
            "You are not authorized to view this employee's documents",
            401,
            "UNAUTHORIZED"
        );
    }

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
            employeeId,
        },
        include: {
            employee: {
                select: {
                    first_name: true,
                    last_name: true,
                    avatar_url: true,
                    department: true,
                },
            },
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

    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(now.getDate() + 30);

    const formattedDocuments = await Promise.all(
        documents.map(async (document) => {
            let expiry_status = "ok";

            if (document.expiryDate) {
                if (document.expiryDate < now) {
                    expiry_status = "expired";
                } else if (document.expiryDate < thirtyDaysFromNow) {
                    expiry_status = "expiring_soon";
                }
            }

            const fileUrl = document.fileUrl?.startsWith("http")
                ? document.fileUrl
                : document.fileUrl
                    ? await getPresignedUrl(document.fileUrl)
                    : null;

            const avatarUrl = document.employee.avatar_url
                ? await getPresignedUrl(document.employee.avatar_url)
                : null;

            return {
                id: document.id,
                employeeId: document.employeeId,

                employee: {
                    first_name: document.employee.first_name,
                    last_name: document.employee.last_name,
                    avatar_url: avatarUrl,
                    department: document.employee.department,
                },

                fileName: document.fileName,
                fileUrl,
                fileSizeMb: document.fileSizeMb,
                status: document.status,
                expiryDate: document.expiryDate,
                notes: document.notes,
                uploadedAt: document.uploadedAt,

                documentType: {
                    id: document.documentType.id,
                    name: document.documentType.name,
                },

                verified_by_name: document.verifier
                    ? `${document.verifier.first_name} ${document.verifier.last_name}`
                    : null,

                expiry_status,
            };
        })
    );

    return formattedDocuments;
};

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
    status: "approved" | "rejected",
    notes: string | undefined,
    requestingUser: AuthenticatedUser

) => {

    if (!["admin", "hr"].includes(requestingUser.role)) {
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

    const [total, pending, approved, rejected] = await Promise.all([
        prisma.employeeDocument.count(),
        prisma.employeeDocument.count({ where: { status: "pending" } }),
        prisma.employeeDocument.count({ where: { status: "approved" } }),
        prisma.employeeDocument.count({ where: { status: "rejected" } })
    ]);


    return { total, pending, approved, rejected };

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

export const getExpiredDocuments = async () => {
    const today = new Date();

    const expiredDocuments = await prisma.employeeDocument.findMany({
        where: {
            expiryDate: {
                lt: today,
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
        expiredDocuments.map(async (doc) => ({
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

export const getDocumentById = async (documentId: string) => {
    const employeeDocument = await prisma.employeeDocument.findFirst({
        where: {
            id: documentId,
        },
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
                    email: true,
                    avatar_url: true,
                },
            },
        },
    });

    if (!employeeDocument) {
        return null;
    }

    return {
        id: employeeDocument.id,
        fileName: employeeDocument.fileName,
        fileUrl: await getPresignedUrl(employeeDocument.fileUrl),
        fileSizeMb: employeeDocument.fileSizeMb,
        uploadedAt: employeeDocument.uploadedAt,
        expiryDate: employeeDocument.expiryDate,
        status: employeeDocument.status,
        employee: {
            name: `${employeeDocument.employee.first_name} ${employeeDocument.employee.last_name}`,
            email: employeeDocument.employee.email,
            avatar: employeeDocument.employee.avatar_url
                ? await getPresignedUrl(employeeDocument.employee.avatar_url)
                : null,
        },
        documentType: {
            name: employeeDocument.documentType.name,
        },
    };
};