import { Notification } from '../entities/Notification';

export interface INotificationService {
  registerNotification(notification: Notification): Promise<void>;
  listNotifications(userId: string): Promise<Notification[]>;
  markAsRead(notificationId: string): Promise<void>;
  removeNotificationByLike(params: {
    toUserId: string;
    fromUserId: string;
    productId: string;
    }): Promise<void>;
}