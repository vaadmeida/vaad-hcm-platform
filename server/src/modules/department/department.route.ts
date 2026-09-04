import { Router } from "express";
import { authenticate } from "../../middlewares/auth.ts";
import { requireRoles } from "../../middlewares/role.ts";
import { assignDepartmentManagerController, createDepartmentController, getDepartmentByIdController, getDepartmentController, getDepartmentStatsController, removeDepartmentManagerController, teamMembersController, teamRecentActivitiesController, updateDepartmentController } from "./department.controller.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";


const departmentRouter  = Router()

departmentRouter.post('/',  authenticate , requireRoles('admin'), asyncHandler(createDepartmentController))
departmentRouter.get('/',  authenticate , requireRoles('admin', "hr"), asyncHandler(getDepartmentController))
departmentRouter.get('/:id/employees',  authenticate , requireRoles('admin', "hr"), asyncHandler(teamMembersController))
departmentRouter.get('/:id',  authenticate , requireRoles('admin', "hr"), asyncHandler(getDepartmentByIdController))
departmentRouter.patch('/:id',  authenticate , requireRoles('admin', "hr"), asyncHandler(updateDepartmentController))
departmentRouter.patch('/:id/manager',  authenticate , requireRoles('admin', "hr"), asyncHandler(assignDepartmentManagerController))
departmentRouter.get('/:departmentId/activities',  authenticate , requireRoles('admin', "hr"), asyncHandler(teamRecentActivitiesController))
departmentRouter.get('/:departmentId/stats',  authenticate , requireRoles('admin', "hr"), asyncHandler(getDepartmentStatsController))
departmentRouter.delete('/:departmentId/manager',  authenticate , requireRoles('admin', "hr"), asyncHandler(removeDepartmentManagerController))

export default departmentRouter