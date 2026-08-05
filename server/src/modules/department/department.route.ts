import { Router } from "express";
import { authenticate } from "../../middlewares/auth.ts";
import { requireRoles } from "../../middlewares/role.ts";
import { createDepartmentController, getDepartmentByIdController, getDepartmentController } from "./department.controller.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import dashboardRouter from "../dashboard/dashboard.route.ts";

const departmentRouter  = Router()

departmentRouter.post('/',  authenticate , requireRoles('admin'), asyncHandler(createDepartmentController))
departmentRouter.get('/',  authenticate , requireRoles('admin'), asyncHandler(getDepartmentController))
departmentRouter.get('/:id',  authenticate , requireRoles('admin'), asyncHandler(getDepartmentByIdController))

//departmentRouter.put('/:id',  authenticate , requireRoles('admin'), asyncHandler(updateDepartmentController))
//departmentRouter.delete('/:id',  authenticate , requireRoles('admin'), asyncHandler(deactiveDepartmentController))

export default departmentRouter