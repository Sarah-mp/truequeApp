// app/profile.tsx
import React, { useState } from 'react';
import { Alert, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Divider, IconButton, Menu } from 'react-native-paper';
import { useRouter } from 'expo-router';
import { ProfileScreen } from '../components/perfil'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { deleteUser, signOut, User } from 'firebase/auth';
import { auth } from '@/config/firebase';


export default function ProfilePage() {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const logout = async () => {
    await signOut(auth);
    router.replace("/");
  };
  const confirmDelete = () =>
    Alert.alert("Eliminar cuenta", "¿Seguro?", [
      { text: "No" },
      {
        text: "Sí",
        onPress: async () => {
          if (user) {
            await deleteUser(user);
            router.replace("/");
          }
        },
      },
    ])
  const handleSignOut = () => {
    logout();
  };

  const handleDelete = () => {
    confirmDelete();
  };

  const handleHelp = () => {
    router.push("/");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <ProfileScreen />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
});
