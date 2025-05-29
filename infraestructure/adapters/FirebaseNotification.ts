import {
    collection, addDoc, query, where, onSnapshot, orderBy, updateDoc, doc,
    deleteDoc,
    getDocs
  } from 'firebase/firestore';
  import { db } from '@/config/firebase';
  import { INotificationService } from '@/domain/interfaces/INotificationService';
  import { Notification } from '@/domain/entities/Notification';
  
  export class FirebaseNotificationAdapter implements INotificationService {
    async registerNotification(n: Notification) {
      await addDoc(collection(db, 'notificaciones'), {
        toUserId: n.toUserId,
        fromUserId: n.fromUserId,
        fromUserName: n.fromUserName,
        productId: n.productId,
        productTitle: n.productTitle,
        type: n.type,
        createdAt: n.createdAt,
        isRead: n.isRead,
      });
    }
  
    listNotifications(userId: string): Promise<Notification[]> {
      return new Promise((resolve) => {
        const q = query(
          collection(db, 'notificaciones'),
          where('toUserId', '==', userId),
          orderBy('createdAt', 'desc')
        );
        onSnapshot(q, (snap) => {
          const items = snap.docs.map(d => {
            const data = d.data() as any;
            return {
              id: d.id,
              toUserId: data.toUserId,
              fromUserId: data.fromUserId,
              fromUserName: data.fromUserName,
              productId: data.productId,
              productTitle: data.productTitle,
              type: data.type,
              createdAt: data.createdAt.toDate(),
              isRead: data.isRead,
            };
          });
          resolve(items);
        });
      });
    }
  
    async markAsRead(notificationId: string) {
      const ref = doc(db, 'notificaciones', notificationId);
      await updateDoc(ref, { isRead: true });
    }

    async removeNotificationByLike(params: {
      toUserId: string;
      fromUserId: string;
      productId: string;
    }): Promise<void> {
      const { toUserId, fromUserId, productId } = params;
  
      // Buscamos el/los documento(s) que coincidan
      const q = query(
        collection(db, 'notificaciones'),
        where('toUserId',    '==', toUserId),
        where('fromUserId',  '==', fromUserId),
        where('productId',   '==', productId),
        where('type',        '==', 'like'),
      );
      const snap = await getDocs(q);
  
      // Borramos todos los docs encontrados (normalmente uno solo)
      await Promise.all(
        snap.docs.map(d => deleteDoc(doc(db, 'notificaciones', d.id)))
      );
    }
  }

