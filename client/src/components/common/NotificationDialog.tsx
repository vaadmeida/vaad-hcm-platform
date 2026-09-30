import { Bell, CheckCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    title: "New employee added",
    message: "John Doe has been added to the HR system.",
    time: "10 minutes ago",
    read: false,
  },
  {
    id: "2",
    title: "Document pending approval",
    message: "A new employee document requires your review.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    title: "Leave request approved",
    message: "Your leave request has been approved.",
    time: "Yesterday",
    read: true,
  },
];

interface NotificationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NotificationDialog = ({
  open,
  onOpenChange,
}: NotificationDialogProps) => {
  const unreadCount = notifications.filter(
    (notification) => !notification.read
  ).length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden bg-white">
        <DialogHeader className="border-b border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-base font-semibold">
                Notifications
              </DialogTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                {unreadCount > 0
                  ? `${unreadCount} unread notification${
                      unreadCount > 1 ? "s" : ""
                    }`
                  : "You're all caught up"}
              </p>
            </div>

            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs"
              >
                <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
                Mark all as read
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="max-h-105 overflow-y-auto">
          {notifications.length > 0 ? (
            <div className="divide-y divide-border">
              {notifications.map((notification) => (
                <button
                  key={notification.id}
                  className="flex w-full gap-3 px-5 py-4 text-left transition-colors hover:bg-muted/50 cursor-pointer"
                >
                  <div
                    className={`mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      notification.read
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary/10 text-primary"
                    }`}
                  >
                    <Bell className="h-4 w-4" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className={`text-sm ${
                          notification.read
                            ? "font-medium"
                            : "font-semibold"
                        }`}
                      >
                        {notification.title}
                      </p>

                      {!notification.read && (
                        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />
                      )}
                    </div>

                    <p className="mt-1 text-xs leading-5 text-muted-foreground">
                      {notification.message}
                    </p>

                    <p className="mt-2 text-[11px] text-muted-foreground">
                      {notification.time}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center px-5 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                <Bell className="h-5 w-5 text-muted-foreground" />
              </div>

              <h3 className="mt-4 text-sm font-semibold">
                No notifications
              </h3>

              <p className="mt-1 text-xs text-muted-foreground">
                You're all caught up. New notifications will appear here.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NotificationDialog;