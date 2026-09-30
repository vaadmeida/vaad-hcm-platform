import { Router } from "express";
import { authenticate } from "../../middlewares/auth.ts";
import { deleteNotificationController, getUnreadNotificationCountController, getUserNotifications, markAllNotificationsAsReadController, markNotificationAsReadController } from "./notifiction.controller.ts";
import { asyncHandler } from "../../utils/asyncHandler.ts";


const notificationRouter = Router();

notificationRouter.get("/", authenticate,  asyncHandler(getUserNotifications));
notificationRouter.get( "/unread-count",authenticate,getUnreadNotificationCountController);
notificationRouter.patch("/read-all",authenticate, asyncHandler(markAllNotificationsAsReadController));
notificationRouter.patch("/:id/read",authenticate, asyncHandler(markNotificationAsReadController));
notificationRouter.delete("/:id",authenticate, asyncHandler(deleteNotificationController));


export default notificationRouter;