import { Router } from "express";
import { asyncHandler } from "../../utils/asyncHandler.ts";
import { approveOrRejectRequestController, cancelRequestController, createLeaveTypesController, getAllLeaveBalancesController, getAllLeaveTypesController, getEmployeeLeaveBalanceController, getLeaveRequestsController, getLeaveStats, getLeaveTypesController, getMyLeaveBalanceController, getRecentLeaveRequestController, getTeamLeaveBalancesController, getUpcomingLeaveRequestController, submitLeaveRequestsController } from "./leave.controller.ts";
import { requireRoles } from "../../middlewares/role.ts";
import { authenticate } from "../../middlewares/auth.ts";

const leaveRouter = Router();

// LEAVE TYPES
leaveRouter.get("/", authenticate, asyncHandler(getAllLeaveTypesController));
leaveRouter.post("/", authenticate, requireRoles("admin"), asyncHandler(createLeaveTypesController));

// STATS
leaveRouter.get("/stats", authenticate, asyncHandler(getLeaveStats));

// LEAVE BALANCE
leaveRouter.get("/balance", authenticate, asyncHandler(getMyLeaveBalanceController));
leaveRouter.get("/balance/team", authenticate, asyncHandler(getTeamLeaveBalancesController));
leaveRouter.get("/balance/all", authenticate, requireRoles("admin", "hr"), asyncHandler(getAllLeaveBalancesController));
leaveRouter.get("/balance/:id", authenticate, requireRoles("admin", "hr" , "manager"), asyncHandler(getEmployeeLeaveBalanceController));

// LEAVE REQUESTS
leaveRouter.get("/request", authenticate, asyncHandler(getLeaveRequestsController));
leaveRouter.get("/upcoming", authenticate, asyncHandler(getUpcomingLeaveRequestController));
leaveRouter.get("/recent", authenticate, asyncHandler(getRecentLeaveRequestController));

leaveRouter.post("/request", authenticate, asyncHandler(submitLeaveRequestsController));

leaveRouter.patch("/:id/cancel", authenticate, asyncHandler(cancelRequestController));
leaveRouter.patch("/:id", authenticate, asyncHandler(approveOrRejectRequestController));

// GET ONE LEAVE TYPE
// Keep this LAST because /:id is a catch-all for one-segment GET routes
leaveRouter.get("/:id", authenticate, requireRoles("admin"), asyncHandler(getLeaveTypesController));

export default leaveRouter;