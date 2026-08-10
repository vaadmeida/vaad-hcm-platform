import { Router } from "express";
import { authenticate } from "../../middlewares/auth.ts";
import { requireRoles } from "../../middlewares/role.ts";
import { assignDepartmentManagerController, createDepartmentController, getDepartmentByIdController, getDepartmentController, updateDepartmentController } from "./department.controller.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";


const departmentRouter  = Router()

departmentRouter.post('/',  authenticate , requireRoles('admin'), asyncHandler(createDepartmentController))
departmentRouter.get('/',  authenticate , requireRoles('admin', "hr"), asyncHandler(getDepartmentController))
departmentRouter.get('/:id',  authenticate , requireRoles('admin', "hr"), asyncHandler(getDepartmentByIdController))
departmentRouter.patch('/:id',  authenticate , requireRoles('admin'), asyncHandler(updateDepartmentController))
departmentRouter.patch('/:id/manager',  authenticate , requireRoles('admin'), asyncHandler(assignDepartmentManagerController))
//departmentRouter.patch('/:id/employees',  authenticate , requireRoles('admin'), asyncHandler(assignDepartmentManagerController))
//departmentRouter.delete('/:id',  authenticate , requireRoles('admin'), asyncHandler(deactiveDepartmentController))

export default departmentRouter