import Contraseña from "@/components/Contraseña";
import Formulario from "@/components/Formulario";
import React, { useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "@/components/logo";
import GeneralBoton from "@/components/GeneralBoton";
import { router } from "expo-router";
import { FirebaseAuthAdapter } from "@/infraestructure/adapters/FirebaseAuthAdapter";
import { makeRedirectUri } from "expo-auth-session";
import * as Google from 'expo-auth-session/providers/google';
import RecuperarContrasena from "./RecuperarContrasena";

export default function HomeScreen() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID!,
    redirectUri: makeRedirectUri({ useProxy: true } as any),
    scopes: ['profile', 'email'],
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);

  const authService = new FirebaseAuthAdapter();

  const handleLogin = async () => {
    setErrorMessage("");
    setEmailError(false);
    setPasswordError(false);

    if (!email || !password) {
      setErrorMessage("Por favor ingresa tu correo y contraseña");
      setEmailError(!email);
      setPasswordError(!password);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Por favor ingresa un correo electrónico válido");
      setEmailError(true);
      return;
    }

    if (password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres");
      setPasswordError(true);
      return;
    }

    try {
      setLoading(true);
      await authService.login(email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      if (error.message === "Credenciales inválidas") {
        setErrorMessage("Correo o contraseña incorrectos");
        setEmailError(true);
        setPasswordError(true);
      } else {
        setErrorMessage(error.message || "Error desconocido al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    console.log("redirectUri", makeRedirectUri({ useProxy: true } as any));
    
    try {
      const result = await promptAsync({ useProxy: true } as any);
      if (result?.type === "success" && result.authentication?.accessToken) {
        await authService.loginWithGoogle(result.authentication.accessToken);
        router.replace("/(tabs)");
      } else {
        setErrorMessage("Autenticación cancelada");
      }
    } catch (error: any) {
      setErrorMessage(error.message || "Error al iniciar sesión con Google");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Logo
          source={require("@/assets/Icons/Nombre.png")}
          height={100}
          width={100}
        />
      </View>
  
      <View style={styles.bottomContainer}>
        <SafeAreaView>
          <View style={styles.formContainer}>
            <Formulario
              label="Correo Electrónico"
              texto={email}
              onChangeText={(text) => {
                setEmail(text);
                setEmailError(false);
                setErrorMessage("");
              }}
              outlineColor={emailError ? "#ff0000" : "#0100FE"}
            />
  
            <Contraseña
              label="Contraseña"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setPasswordError(false);
                setErrorMessage("");
              }}
              outlineColor={passwordError ? "#ff0000" : "#0100FE"}
            />
  
            <GeneralBoton
              texto={loading ? "Cargando..." : "INICIAR SESIÓN"}
              colorFondo="#0100FE"
              colorTexto="#ffffff"
              onPress={handleLogin}
              disabled={loading}
            />
  
            {errorMessage && (
              <Text style={styles.errorMessage}>{errorMessage}</Text>
            )}
  
            <View style={styles.linksContainer}>
              <GeneralBoton
                texto="¿Olvidó su contraseña?"
                colorFondo="#ffffff"
                colorTexto="#999999"
                onPress={() => router.push("/RecuperarContrasena")}
              />
              <GeneralBoton
                texto="Regístrate"
                colorFondo="#ffffff"
                colorTexto="#999999"
                onPress={() => router.push("/registro")}
              />
            </View>
  
            <GeneralBoton
              texto="Continuar con Google"
              colorFondo="#ced4da"
              colorTexto="#999999"
              onPress={handleGoogleLogin}
              disabled={loading}
            />
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0100FE",
  },
  topContainer: {
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    borderTopRightRadius: 40,
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  formContainer: {
    gap: 20,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
    paddingHorizontal: 20,
  },
  linksContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  errorMessage: {
    color: "red",
    textAlign: "center",
  },
});
