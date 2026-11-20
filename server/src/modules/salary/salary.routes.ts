import express from 'express';
import { authenticate } from '../../middlewares/auth.ts';
import { asyncHandler } from '../../utils/asyncHandler.ts';
import { createEmployeeSalaryController, deleteEmployeeSalaryHistoryController, EmployeeSalaryReviewController, getAllEmployeesSalaryController, getEmployeeSalaryController, getEmployeeSalaryHistoryController, getMySalaryController } from './salary.controller.ts';
import { requireRoles } from '../../middlewares/role.ts';


const salaryRouter = express.Router();

salaryRouter.get("/employees",authenticate, requireRoles("admin", "hr"),asyncHandler(getAllEmployeesSalaryController));
salaryRouter.get("/me", authenticate, asyncHandler(getMySalaryController));
salaryRouter.get("/employees/:employeeId", authenticate, requireRoles("admin", "hr"), asyncHandler(getEmployeeSalaryController));
salaryRouter.post("/employees/:employeeId", authenticate, requireRoles("admin", "hr"), asyncHandler(createEmployeeSalaryController));
salaryRouter.post("/employees/:employeeId/review", authenticate, requireRoles("admin", "hr"), asyncHandler(EmployeeSalaryReviewController));
salaryRouter.get("/employees/:employeeId/history",authenticate,asyncHandler(getEmployeeSalaryHistoryController));
salaryRouter.delete("/employees/:employeeId/salary-history/:salaryId",authenticate, requireRoles("admin", "hr"),deleteEmployeeSalaryHistoryController);

export default salaryRouter;