import { Request, Response } from "express";
import { deleteNotification, getNotifications, getUnreadNotificationCount, markAllNotificationsAsRead, markNotificationAsRead } from "./notification.service.ts";


export const getUserNotifications = (async (req: Request, res: Response) => {

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    const notifications = await getNotifications(req.user.id);

    return res.status(200).json({
        success: true,
        data: notifications,
    });
}

);

export const getUnreadNotificationCountController = (async (req: Request, res: Response) => {
    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "Unauthorized",
        });
    }

    const count = await getUnreadNotificationCount(req.user.id);

    return res.status(200).json({
        success: true,
        data: {
            count,
        },
    });
}
);


export const markNotificationAsReadController = (
    async (req: Request, res: Response) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const { id } = req.params;

        if (typeof id !== "string") {
            return res.status(400).json({
                success: false,
                message: "Invalid notification ID",
            });
        }
        const notification = await markNotificationAsRead(
            id,
            req.user.id
        );

        return res.status(200).json({
            success: true,
            message: "Notification marked as read",
            data: notification,
        });
    }
);


export const markAllNotificationsAsReadController = (async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const result = await markAllNotificationsAsRead(req.user.id);

    return res.status(200).json({
      success: true,
      message: "All notifications marked as read",
      data: {
        count: result.count,
      },
    });
  }
);


export const deleteNotificationController =(
  async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const { id } = req.params;

    if (typeof id !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID",
      });
    }

    await deleteNotification(id, req.user.id);

    return res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
    });
  }
);