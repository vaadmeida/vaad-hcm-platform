import { Request, Response } from "express";
import { updateMyProfileValidator, updateOrganizationValidator } from "./settings.validator.ts";
import { AppError } from "../../errors/appError.ts";
import { User } from "../employees/employee.service.ts";
import { getOrganization, UpdateMyProfile, UpdateMyProfileAvatar, updateOrganizationSettings, } from "./settings.services.ts";


export const UpdateMyProfileController = async (req: Request, res: Response) => {

    const result = updateMyProfileValidator.safeParse(req.body);

    if (!result.success) {
        throw new AppError(
            result.error.issues[0]?.message || "Invalid profile data",
            400,
            "VALIDATION_ERROR"
        );
    }

    const user = req.user as User;

    const updatedProfile = await UpdateMyProfile(
        user,
        result.data
    );

    return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: updatedProfile,
    });

}

export const getOrganizationController = async (
    req: Request,
    res: Response,
) => {

    const organization = await getOrganization();

    return res.status(200).json({
        success: true,
        message: "Organization fetched successfully",
        data: organization,
    });

};


export const updateOrganizationController = async (
    req: Request,
    res: Response,
) => {
    const validation = updateOrganizationValidator.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validation.error.flatten().fieldErrors,
        });
    }

    const organization = await updateOrganizationSettings(
        validation.data
    );

    return res.status(200).json({
        success: true,
        message: "Organization updated successfully",
        data: organization,
    });
};



export const UpdateMyProfileAvatarController = async (
    req: Request,
    res: Response
) => {

    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const user = req.user as User;

    const updatedProfile = await UpdateMyProfileAvatar(
        user,
        req.file!
    );

    return res.status(200).json({
        success: true,
        message: "Profile image updated successfully",
        data: updatedProfile,
    });
};

