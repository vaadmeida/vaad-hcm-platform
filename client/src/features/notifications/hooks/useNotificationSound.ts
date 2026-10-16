
import { useEffect, useRef } from "react";
import { useNotifications } from "./useNotifications";

export const useNotificationSound = () => {
  console.log("🔔 Notification sound hook mounted");

  const { data: notifications = [], isSuccess } = useNotifications(5);
  const previousIds = useRef<Set<string> | null>(null);

  useEffect(() => {
    if (!isSuccess) return;

    console.log("🔔 Notifications fetched:", notifications.length);

    const currentIds = new Set(
      notifications.map((notification) => notification.id)
    );

    if (previousIds.current === null) {
      previousIds.current = currentIds;
      console.log("🔔 Initial notification IDs saved");
      return;
    }

    const hasNewNotification = [...currentIds].some(
      (id) => !previousIds.current!.has(id)
    );

    if (hasNewNotification) {
      console.log("🔔 New notification detected!");

      const audio = new Audio("/sounds/notification.mp3");

      audio.play()
        .then(() => console.log("🔊 Sound played successfully"))
        .catch((error) => console.error("🔇 Sound playback failed:", error));
    }

    previousIds.current = currentIds;
  }, [notifications, isSuccess]);
};
