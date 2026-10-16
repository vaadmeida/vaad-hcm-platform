import { useQuery } from "@tanstack/react-query";
import { getNotifications } from "../api/notification.api";

export const useNotifications = (limit = 5) => {
  return useQuery({
    queryKey: ["notifications", limit],
    queryFn: () => getNotifications(limit),
    refetchInterval: 15_000,
  });
};