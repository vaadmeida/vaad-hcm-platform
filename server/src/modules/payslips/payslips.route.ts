import express from "express";
import { authenticate } from "../../middlewares/auth.ts";
import { requireRoles } from "../../middlewares/role.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { downloadPayslipController } from "./payslip.controller.ts";


const payslipsRouter = express.Router();

payslipsRouter.get("/:payslipId/download", authenticate ,requireRoles("admin", "hr"),asyncHandler(downloadPayslipController));

export default payslipsRouter;


