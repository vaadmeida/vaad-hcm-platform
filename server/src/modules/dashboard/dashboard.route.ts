import { Router } from "express";
import { authenticate } from "../../middlewares/auth.ts";
import { requireRoles } from "../../middlewares/role.ts";
import { getDashboardStats } from "./dashbaord.controller.ts";

const dashboardRouter = Router()

dashboardRouter.get("/stats", authenticate , requireRoles('admin'), getDashboardStats)


export default dashboardRouter