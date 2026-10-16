import { useQuery } from "@tanstack/react-query";
import { getUnreadNotificationCount } from "../api/notification.api";

export const useUnreadNotificationCount = () => {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: getUnreadNotificationCount,
  });
};