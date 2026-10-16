
export type NotificationType =
  | "LEAVE"
  | "DOCUMENT"
  | "ATTENDANCE"
  | "PAYSLIP"
  | "DEPARTMENT"
  | "EMPLOYEE"
  | "SYSTEM";

export interface AppNotification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  read_at: string | null;
}

export interface NotificationsResponse {
  success: boolean;
  data: AppNotification[];
}


export interface UnreadCountResponse {
  success: boolean;
  data: {
    count: number;
  };
}

export interface NotificationResponse {
  success: boolean;
  data: Notification;
}

export interface NotificationQueryParams {
  page?: number;
  limit?: number;
  unreadOnly?: boolean;
}
