// app/notifications.tsx
import React, { useState, useEffect } from 'react';
import { View, FlatList, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from 'firebase/firestore';
import { auth, db } from '@/config/firebase';
import NotificationItem, { NotificationItemProps } from '@/components/NotificationItem';
import { NotificationService } from '@/domain/servicios/NotificationService';


export default function NotificationsScreen() {
  const [notifications, setNotifications] = useState<NotificationItemProps[]>([]);
  const router = useRouter();
  const user = auth.currentUser;

  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'notificaciones'),
      where('toUserId', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsub = onSnapshot(
      q,
      snap => {
        const items: NotificationItemProps[] = snap.docs.map(docSnap => {
          const d = docSnap.data() as any;
          return {
            id:       docSnap.id,
            type:     d.type,
            message:  d.type === 'like'
                       ? `${d.fromUserName} le dio like a "${d.productTitle}"`
                       : `${d.fromUserName} solicitó "${d.productTitle}"`,
            date:     d.createdAt.toDate(),
            isRead:   d.isRead,
            onPress:  async () => {
              // Marca como leído
              await NotificationService.markAsRead(docSnap.id);
              // Navega a detalle usando el productId correcto
              router.push(`/detalle?productId=${d.productId}`);
            },
          };
        });
        setNotifications(items);
      },
      err => console.error('Error onSnapshot notificaciones:', err)
    );

    return () => unsub();
  }, [user]);

  return (
    <View style={styles.container}>
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <NotificationItem {...item} />
        )}
        ListEmptyComponent={<Text style={styles.empty}>No hay notificaciones</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  empty:     { textAlign: 'center', marginTop: 20, color: '#666' },
});
