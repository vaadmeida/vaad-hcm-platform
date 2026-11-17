import express from "express";
import { authenticate } from "../../middlewares/auth.ts";
import { requireRoles } from "../../middlewares/role.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { approvePayrollController, calculatePayrollController, getPayrollByIdController, getPayrollsController, preparePayrollController, reviewPayrollController } from "./payroll.controller.ts";

const payrollRouter = express.Router();

payrollRouter.post("/prepare", authenticate,requireRoles("admin", "hr"),asyncHandler(preparePayrollController));
payrollRouter.post("/:payrollId/calculate",authenticate,requireRoles("admin", "hr"),asyncHandler(calculatePayrollController));
payrollRouter.get("/:payrollId",authenticate, requireRoles("admin", "hr"), asyncHandler(getPayrollByIdController));
payrollRouter.get("/",authenticate,requireRoles("admin", "hr"),getPayrollsController);
payrollRouter.patch("/:payrollId/review",authenticate,requireRoles("admin", "hr"), asyncHandler(reviewPayrollController));
payrollRouter.patch("/:payrollId/approve",authenticate,requireRoles("admin"), asyncHandler(approvePayrollController));

export default payrollRouter;