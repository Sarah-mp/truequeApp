// app/(ingreso)/RecuperarContrasena.tsx

import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Formulario from "@/components/Formulario";
import GeneralBoton from "@/components/GeneralBoton";
import { AuthService } from "@/domain/servicios/authService";
import Logo from "@/components/logo";
import { IconButton } from "react-native-paper";
import { router } from "expo-router";

function RecuperarContrasenaScreen() {
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleResetPassword = async () => {
    setErrorMessage("");
    setSuccessMessage("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMessage("Ingresa un correo válido");
      return;
    }

    try {
      await AuthService.sendPasswordReset(email);
      setSuccessMessage("Se ha enviado un correo para restablecer tu contraseña");
    } catch (error: any) {
      setErrorMessage(error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <IconButton
          icon="arrow-left"
          iconColor="white"
          size={28}
          onPress={() => router.navigate("/")}
        />
      <View style={styles.topContainer}>
        
        <Logo
          source={require("@/assets/Icons/Nombre.png")}
          height={100}
          width={100}
        />
      </View>
      <View style={styles.bottomContainer}>

        <Text style={styles.titulo}>Recuperar contraseña</Text>
        <View style={styles.formContainer}>
        <Formulario
        label="Correo electrónico"
        texto={email}
        onChangeText={setEmail}
        outlineColor="#0100FE"
        />

        {errorMessage && <Text style={styles.error}>{errorMessage}</Text>}
        {successMessage && <Text style={styles.success}>{successMessage}</Text>}

       <GeneralBoton
        texto="Enviar correo de recuperación"
        colorFondo="#0100FE"
        colorTexto="#ffffff"
        onPress={handleResetPassword}
        />
      </View>
    </View>
    </SafeAreaView>
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
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: '#0100FE',
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  success: {
    color: "green",
    textAlign: "center",
  },
});

export default RecuperarContrasenaScreen;