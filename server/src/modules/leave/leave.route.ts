import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { approveOrRejectRequestController, cancelRequestController, createLeaveTypesController, getAllLeaveTypesController, getLeaveRequestsController, getLeaveTypesController, getMyLeaveBalanceController, submitLeaveRequestsController } from "./leave.controller.ts";
import { requireRoles } from "../../middlewares/role.ts";
import { authenticate } from "../../middlewares/auth.ts";

const leaveRouter = Router()

leaveRouter.post('/' , authenticate, requireRoles('admin'), asyncHandler(createLeaveTypesController))
leaveRouter.get('/', authenticate , asyncHandler(getAllLeaveTypesController))
leaveRouter.get('/:id/balance' , authenticate , asyncHandler(getMyLeaveBalanceController))
leaveRouter.get('/request' , authenticate , asyncHandler(getLeaveRequestsController))
leaveRouter.get('/:id' , authenticate, requireRoles('admin'), asyncHandler(getLeaveTypesController))
leaveRouter.post('/request', authenticate , asyncHandler(submitLeaveRequestsController))
leaveRouter.patch('/:id', authenticate,  asyncHandler(approveOrRejectRequestController))
leaveRouter.patch('/:id/cancel' , authenticate, asyncHandler(cancelRequestController))


export default leaveRouter