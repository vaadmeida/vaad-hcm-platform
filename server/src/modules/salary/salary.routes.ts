import express from 'express';
import { authenticate } from '../../middlewares/auth.ts';
import { asyncHandler } from '../../utils/asyncHandler.ts';
import { createEmployeeSalaryController, getEmployeeSalaryController, getMySalaryController } from './salary.controller.ts';
import { requireRoles } from '../../middlewares/role.ts';


const salaryRouter = express.Router();

salaryRouter.get("/me", authenticate, asyncHandler(getMySalaryController));
salaryRouter.get("/employees/:employeeId",authenticate, requireRoles("admin", "hr"), asyncHandler(getEmployeeSalaryController));
salaryRouter.post("/employees/:employeeId",authenticate, requireRoles("admin","hr"), asyncHandler(createEmployeeSalaryController));


export default salaryRouter;