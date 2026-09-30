import prisma from "../../config/prisma.ts";
import { CreateNotificationInput } from "./notification.types.ts";



export const createNotification = async ({
  userId,
  title,
  message,
  type,
}: CreateNotificationInput) => {
  return prisma.notification.create({
    data: {
      user_id: userId,
      title,
      message,
      type,
    },
  });
};

export const getNotifications = async (userId: string) => {
  return prisma.notification.findMany({
    where: {
      user_id: userId,
    },
    orderBy: {
      created_at: "desc",
    },
  });
};


export const getUnreadNotificationCount = async (userId: string) => {
  return prisma.notification.count({
    where: {
      user_id: userId,
      is_read: false,
    },
  });
};


export const markNotificationAsRead = async (
  notificationId: string,
  userId: string
) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      user_id: userId,
    },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  return prisma.notification.update({
    where: {
      id: notificationId,
    },
    data: {
      is_read: true,
      read_at: new Date(),
    },
  });
};


export const markAllNotificationsAsRead = async (userId: string) => {
  return prisma.notification.updateMany({
    where: {
      user_id: userId,
      is_read: false,
    },
    data: {
      is_read: true,
      read_at: new Date(),
    },
  });
};


export const deleteNotification = async (
  notificationId: string,
  userId: string
) => {
  const notification = await prisma.notification.findFirst({
    where: {
      id: notificationId,
      user_id: userId,
    },
  });

  if (!notification) {
    throw new Error("Notification not found");
  }

  return prisma.notification.delete({
    where: {
      id: notificationId,
    },
  });
};