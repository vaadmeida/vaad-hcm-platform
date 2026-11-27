import express from "express";
import { authenticate } from "../../middlewares/auth.ts";
import { requireRoles } from "../../middlewares/role.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { approvePayrollController, calculatePayrollController, deletePayrollController, getPayrollByIdController, getPayrollOverviewController, getPayrollsController, preparePayrollController, processPayrollController, reviewPayrollController } from "./payroll.controller.ts";
import { generatePayrollPayslipsController, listPayrollPayslipsController } from "../payslips/payslip.controller.ts";

const payrollRouter = express.Router();

payrollRouter.get("/overview",authenticate, requireRoles("admin", "hr"),asyncHandler(getPayrollOverviewController));
payrollRouter.post("/prepare", authenticate,requireRoles("admin", "hr"),asyncHandler(preparePayrollController));
payrollRouter.post("/:payrollId/calculate",authenticate,requireRoles("admin", "hr"),asyncHandler(calculatePayrollController));
payrollRouter.get("/:payrollId",authenticate, requireRoles("admin", "hr"), asyncHandler(getPayrollByIdController));
payrollRouter.get("/",authenticate,requireRoles("admin", "hr"),getPayrollsController);
payrollRouter.patch("/:payrollId/review",authenticate,requireRoles("admin", "hr"), asyncHandler(reviewPayrollController));
payrollRouter.patch("/:payrollId/approve",authenticate,requireRoles("admin","hr"), asyncHandler(approvePayrollController));
payrollRouter.post("/:payrollId/process",authenticate,requireRoles("admin","hr"), asyncHandler(processPayrollController));
payrollRouter.delete("/:payrollId",authenticate,requireRoles("admin","hr"), asyncHandler(deletePayrollController));
payrollRouter.get("/:payrollId/payslips", authenticate,requireRoles("admin", "hr"),asyncHandler(listPayrollPayslipsController));
payrollRouter.post("/:payrollId/payslips/generate", authenticate,requireRoles("admin", "hr"),asyncHandler(generatePayrollPayslipsController));

export default payrollRouter;