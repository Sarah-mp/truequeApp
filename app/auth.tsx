import { View, Text } from 'react-native';
import { useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { router } from 'expo-router';
import { auth } from '@/config/firebase';

export default function AuthScreen() {
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user: any) => {
            if (user) {
                router.replace('/');
            } else {
                router.replace('/productos');
            }
        });
        return () => unsubscribe();
    }, []);
    return null;
}
