import { INotificationService } from '../interfaces/INotificationService';
import { FirebaseNotificationAdapter } from '@/infraestructure/adapters/FirebaseNotification';

export const NotificationService: INotificationService = new FirebaseNotificationAdapter();