import { Bell, CheckCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNotifications } from "@/features/notifications/hooks/useNotifications";
import { useUnreadNotificationCount } from "../hooks/useUnreadNotificationCount";


interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formatTime = (dateString: string) => {
  const date = new Date(dateString);
  const diff = Math.max(0, Date.now() - date.getTime());
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
};

const NotificationDialog = ({
  open,
  onOpenChange,
}: NotificationDialogProps) => {
  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
  } = useNotifications(5);

  const { data: unreadCount = 0} = useUnreadNotificationCount();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm gap-0 overflow-hidden bg-white p-0">
        <DialogHeader className="border-b border-border px-4 py-3">
          <div className="flex items-center justify-between gap-2">
            <div>
              <DialogTitle className="text-sm font-semibold">
                Notifications
              </DialogTitle>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "You're all caught up"}
              </p>
            </div>

            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs"
                disabled
                title="Mark all as read is not connected yet"
              >
                <CheckCheck className="mr-1 h-3.5 w-3.5" />
                Mark all read
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="max-h-80 overflow-y-auto">
          {isLoading ? (
            <p className="px-4 py-8 text-center text-xs text-muted-foreground">
              Loading notifications...
            </p>
          ) : isError ? (
            <div className="flex flex-col items-center gap-2 px-4 py-8 text-center">
              <p className="text-xs text-destructive">
                Failed to load notifications.
              </p>

              <Button variant="outline" size="sm" onClick={() => refetch()}>
                Try again
              </Button>
            </div>
          ) : notifications.length > 0 ? (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="flex gap-2.5 px-4 py-3 transition-colors hover:bg-muted/50"
                >
                  <div
                    className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                      notification.is_read
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Bell className="h-3.5 w-3.5" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-xs ${
                          notification.is_read
                            ? "font-medium"
                            : "font-semibold"
                        }`}
                      >
                        {notification.title}
                      </p>

                      {!notification.is_read && (
                        <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-red-500" />
                      )}
                    </div>

                    <p className="mt-1 text-xs leading-4 text-muted-foreground">
                      {notification.message}
                    </p>

                    <p className="mt-1.5 text-[10px] text-muted-foreground">
                      {formatTime(notification.created_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center px-4 py-8 text-center">
              <Bell className="h-7 w-7 text-muted-foreground/60" />
              <p className="mt-2 text-xs font-semibold">
                No notifications
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                New notifications will appear here.
              </p>
            </div>
          )}
        </div>

        {!isLoading && !isError && notifications.length > 0 && (
          <div className="border-t border-border p-2">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-full text-xs"
              onClick={() => {
                onOpenChange(false);
                window.location.href = "/notifications";
              }}
            >
              View all notifications
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDialog;