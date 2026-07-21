import { Router } from "express";
import { authenticate } from "../../middlewares/auth.ts";
import { requireRoles } from "../../middlewares/role.ts";
import { createDepartmentController } from "./department.controller.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import dashboardRouter from "../dashboard/dashboard.route.ts";

const departmentRouter  = Router()

departmentRouter.post('/',  authenticate , requireRoles('admin'), asyncHandler(createDepartmentController))

export default departmentRouter