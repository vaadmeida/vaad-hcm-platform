import { Router } from "express";
import { requireRoles } from "../../middlewares/role.ts";
import { authenticate } from "../../middlewares/auth.ts";
import upload from "../../middlewares/upload.ts";
import { createOnboardingMaterialController, deleteOnboardingMaterialController, getOnboardingMaterialsController, updateOnboardingMaterialController } from "./onboarding.controller.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";


const onboardingRouter = Router();

onboardingRouter.post("/materials",authenticate,requireRoles("admin", "hr"), upload.single("document"), asyncHandler(createOnboardingMaterialController));
onboardingRouter.get("/materials",authenticate, asyncHandler(getOnboardingMaterialsController));
onboardingRouter.patch("/materials/:id",authenticate,requireRoles("admin", "hr"),upload.single("document"), asyncHandler(updateOnboardingMaterialController));
onboardingRouter.delete("/materials/:id",authenticate,requireRoles("admin", "hr"),deleteOnboardingMaterialController);


export default onboardingRouter;