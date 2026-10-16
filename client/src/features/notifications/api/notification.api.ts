import { api } from "@/lib";
import type { AppNotification, NotificationsResponse } from "../types/notifications.types";

export const getNotifications = async (
  limit = 5
): Promise<AppNotification[]> => {
  const response = await api.get<NotificationsResponse>(
    "/api/notifications",
    {
      params: { limit },
    }
  );

  return response.data.data;
};


export const getUnreadNotificationCount = async (): Promise<number> => {
  const response = await api.get("/api/notifications/unread-count");

  return response.data.data.count;
};