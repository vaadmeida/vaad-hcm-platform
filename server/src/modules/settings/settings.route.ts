import { Router } from "express";
import { authenticate } from "../../middlewares/auth.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { getOrganizationController, UpdateMyProfileAvatarController, UpdateMyProfileController, updateOrganizationController } from "./settings.controller.ts";
import upload from "../../middlewares/upload.ts";

const settingRouter = Router();

settingRouter.patch( "/profile", authenticate, asyncHandler(UpdateMyProfileController));
settingRouter.patch( "/profile/avatar", authenticate, upload.single("avatar"), asyncHandler(UpdateMyProfileAvatarController));
settingRouter.get( "/organization", authenticate, asyncHandler(getOrganizationController));
settingRouter.patch( "/organization", authenticate, asyncHandler(updateOrganizationController));

export default settingRouter;