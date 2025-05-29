// app/_layout.tsx  (o donde tengas definido tu RootLayout)
import { Stack } from 'expo-router';
import React from 'react';
import { Provider as PaperProvider,  } from 'react-native-paper';
import { Platform } from 'react-native';
import { lightTheme } from '../components/theme'

export default function RootLayout() {
  return (
    <PaperProvider theme={lightTheme}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#f4511e',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerShown: false,
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="registro" />
        <Stack.Screen name="RecuperarContrasena" />
        <Stack.Screen name='detalle'/>
        <Stack.Screen name="auth" />
        <Stack.Screen name="notifications"/>
        <Stack.Screen name='profile'/>
        <Stack.Screen name='productos'/>
        <Stack.Screen name='registroproducto'/>
        <Stack.Screen name='editar'/>
      </Stack>
    </PaperProvider>
  );
}
