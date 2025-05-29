export type Notification = {
    id?: string;            // opcional en creación
    toUserId: string;
    fromUserId: string;
    fromUserName: string;
    productId: string;
    productTitle: string;
    type: 'like' | 'request';
    createdAt: Date;
    isRead: boolean;
  };