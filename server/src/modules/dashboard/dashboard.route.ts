import { Router } from "express";
import { authenticate } from "../../middlewares/auth.ts";
import { requireRoles } from "../../middlewares/role.ts";
import { getDashboardStats, getEmployeesByDepartmentController, getLeaveOverviewController } from "./dashbaord.controller.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";

const dashboardRouter = Router()
dashboardRouter.get("/stats", authenticate , asyncHandler(getDashboardStats))
dashboardRouter.get("/employees-by-department", authenticate, requireRoles("admin", "hr"),asyncHandler(getEmployeesByDepartmentController))
dashboardRouter.get("/leave-overview", authenticate ,asyncHandler(getLeaveOverviewController))


export default dashboardRouter