// src/providers/FirebaseProvider.tsx

import React, { useEffect, useState } from 'react';
import { auth } from '@/config/firebase';
import { router } from 'expo-router';

interface FirebaseProviderProps {
  children: React.ReactNode;
}

export const FirebaseProvider = ({ children }: FirebaseProviderProps) => {
  const [isReady, setIsReady] = useState(false);
  const [initializing, setInitializing] = useState(true);

  // Escuchar cambios de autenticación
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        console.log('Usuario autenticado:', user.email);
      } else {
        console.log('No hay usuario autenticado');
      }
      setIsReady(true);
      setInitializing(false);
    });

    return () => unsubscribe();
  }, []);

  if (initializing || !isReady) {
    return null; // O un splash screen
  }

  return <>{children}</>;
};