import { randomUUID } from "crypto";
import prisma from "../../config/prisma.ts";
import { deleteFromStorage, getPresignedUrl, uploadFileToS3 } from "../../config/storage.ts";
import { AppError } from "../../errors/appError.ts";
import { User } from "../employees/employee.service.ts";
import { UpdateMyProfileInput } from "./settings.types.ts";
import { UpdateOrganizationInput } from "./settings.validator.ts";

export const UpdateMyProfile = async (
    user: User,
    data: UpdateMyProfileInput
) => {

    const employee = await prisma.employee.findUnique({
        where: {
            id: user.id,
        },
        select: {
            id: true,
            email: true,
        },
    });

    if (!employee) {
        throw new AppError(
            "Employee profile not found",
            404,
            "EMPLOYEE_PROFILE_NOT_FOUND"
        );
    }

    // Check if email is being changed
    if (data.email && data.email !== employee.email) {
        const existingEmployee = await prisma.employee.findFirst({
            where: {
                email: data.email,
                id: {
                    not: user.id,
                },
            },
            select: {
                id: true,
            },
        });

        if (existingEmployee) {
            throw new AppError(
                "Email address is already in use",
                409,
                "EMAIL_ALREADY_EXISTS"
            );
        }
    }

    const updatedEmployee = await prisma.employee.update({
        where: {
            id: user.id,
        },
        data: {
            ...(data.first_name !== undefined && {
                first_name: data.first_name,
            }),

            ...(data.middle_name !== undefined && {
                middle_name: data.middle_name,
            }),
            ...(data.last_name !== undefined && {
                last_name: data.last_name,
            }),

            ...(data.email !== undefined && {
                email: data.email,
            }),

            ...(data.phone !== undefined && {
                phone: data.phone,
            }),
        },
        select: {
            id: true,
            employee_code: true,
            first_name: true,
            last_name: true,
            middle_name: true,
            email: true,
            phone: true,
            job_title: true,
            avatar_url: true,
        },
    });

    return {
        id: updatedEmployee.id,
        employee_code: updatedEmployee.employee_code,
        full_name: `${updatedEmployee.first_name} ${updatedEmployee.last_name}`,
        avatar_url: updatedEmployee.avatar_url,
        personal: {
            first_name: updatedEmployee.first_name,
            last_name: updatedEmployee.last_name,
            middle_name: updatedEmployee.middle_name,
            email: updatedEmployee.email,
            phone: updatedEmployee.phone,
        },

        employment: {
            job_title: updatedEmployee.job_title,
        },
    };

}

export const getOrganization = async () => {
    const organization = await prisma.organization.findFirst();

    console.log("PRODUCTION ORGANIZATION:", organization);

    if (!organization) {
        throw new AppError(
            "Organization not found",
            404,
            "ORGANIZATION_NOT_FOUND"
        );
    }

    return organization;
};


export const updateOrganizationSettings = async (
    data: UpdateOrganizationInput
) => {
    const organization = await prisma.organization.findFirst();

    if (!organization) {
        throw new AppError(
            "Organization not found",
            404,
            "ORGANIZATION_NOT_FOUND"
        );
    }

    const updatedOrganization = await prisma.organization.update({
        where: {
            id: organization.id,
        },

        data: {
            ...(data.name !== undefined && {
                name: data.name,
            }),

            ...(data.industry !== undefined && {
                industry: data.industry,
            }),

            ...(data.email !== undefined && {
                email: data.email,
            }),

            ...(data.company_size !== undefined && {
                company_size: data.company_size,
            }),

            ...(data.phone !== undefined && {
                phone: data.phone,
            }),

            ...(data.website !== undefined && {
                website: data.website,
            }),

            ...(data.street_address !== undefined && {
                street_address: data.street_address,
            }),

            ...(data.city !== undefined && {
                city: data.city,
            }),

            ...(data.state !== undefined && {
                state: data.state,
            }),

            ...(data.country !== undefined && {
                country: data.country,
            }),
        },
    });

    return updatedOrganization;
};


export const UpdateMyProfileAvatar = async (
    user: User,
    file: Express.Multer.File
) => {

    if (!file) {
        throw new AppError(
            "Profile image is required",
            400,
            "PROFILE_IMAGE_REQUIRED"
        );
    }

    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp",
    ];

    if (!allowedMimeTypes.includes(file.mimetype)) {
        throw new AppError(
            "Only JPG, PNG, and WEBP images are allowed",
            400,
            "INVALID_IMAGE_TYPE"
        );
    }

    const employee = await prisma.employee.findUnique({
        where: {
            id: user.id,
        },
        select: {
            id: true,
            avatar_url: true,
        },
    });

    if (!employee) {
        throw new AppError(
            "Employee profile not found",
            404,
            "EMPLOYEE_PROFILE_NOT_FOUND"
        );
    }

    const extensionMap: Record<string, string> = {
        "image/jpeg": "jpg",
        "image/png": "png",
        "image/webp": "webp",
    };

    const extension = extensionMap[file.mimetype];

    const key = `employees/profile-images/${employee.id}/${randomUUID()}.${extension}`;

    // Upload new image to S3
    await uploadFileToS3(
        key,
        file.buffer,
        file.mimetype
    );

    try {

        const updatedEmployee = await prisma.employee.update({
            where: {
                id: employee.id,
            },
            data: {
                avatar_url: key,
            },
            select: {
                id: true,
                employee_code: true,
                first_name: true,
                last_name: true,
                middle_name: true,
                email: true,
                phone: true,
                job_title: true,
                avatar_url: true,
            },
        });

        // Delete previous image from S3
        if (employee.avatar_url) {
            try {
                await deleteFromStorage(employee.avatar_url);
            } catch (error) {
                console.error(
                    "Failed to delete previous profile image:",
                    error
                );
            }
        }

        const avatarUrl = updatedEmployee.avatar_url
            ? await getPresignedUrl(updatedEmployee.avatar_url)
            : null;

        return {
            id: updatedEmployee.id,
            employee_code: updatedEmployee.employee_code,
            full_name: `${updatedEmployee.first_name} ${updatedEmployee.last_name}`,
            avatar_url: avatarUrl,
            personal: {
                first_name: updatedEmployee.first_name,
                last_name: updatedEmployee.last_name,
                middle_name: updatedEmployee.middle_name,
                email: updatedEmployee.email,
                phone: updatedEmployee.phone,
            },
            employment: {
                job_title: updatedEmployee.job_title,
            },
        };

    } catch (error) {

        // If database update fails after S3 upload,
        // remove the newly uploaded image.
        try {
            await deleteFromStorage(key);
        } catch (cleanupError) {
            console.error(
                "Failed to cleanup uploaded profile image:",
                cleanupError
            );
        }

        throw error;
    }
};
