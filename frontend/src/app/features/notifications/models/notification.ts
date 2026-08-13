export type NotificationType =
  | 'new_order'
  | 'order_accepted'
  | 'order_rejected'
  | 'order_ready'
  | 'buyer_on_the_way'
  | 'order_completed';

export interface Notification {
  _id: string;
  recipient: string;
  type: NotificationType;
  title: string;
  message: string;
  order: string | null;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface NotificationsResponse {
  message: string;
  notifications: Notification[];
}

export interface UnreadNotificationsCountResponse {
  message: string;
  unreadCount: number;
}

export interface NotificationActionResponse {
  message: string;
  notification: Notification;
}

export interface ReadAllNotificationsResponse {
  message: string;
}