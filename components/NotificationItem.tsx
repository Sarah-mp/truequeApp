// src/components/NotificationItem.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export type NotificationItemProps = {
  id: string;
  type: 'like' | 'request';
  message: string;
  date: Date;
  isRead: boolean;
  onPress?: () => void;
};

export default function NotificationItem({
  type,
  message,
  date,
  isRead,
  onPress,
}: NotificationItemProps) {
  return (
    <TouchableOpacity
      style={[styles.card, !isRead && styles.unread]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <MaterialCommunityIcons
        name={type === 'like' ? 'heart' : 'cart'}
        size={24}
        color={type === 'like' ? '#e91e63' : '#153dda'}
      />
      <View style={styles.info}>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.date}>{date.toLocaleString()}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  unread: {
    backgroundColor: '#f0f8ff',
  },
  info: {
    marginLeft: 12,
    flex: 1,
  },
  message: {
    fontSize: 16,
    color: '#333',
  },
  date: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
});
