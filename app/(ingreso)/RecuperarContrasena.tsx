// app/(ingreso)/RecuperarContrasena.tsx

import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Formulario from "@/components/Formulario";
import GeneralBoton from "@/components/GeneralBoton";
import { AuthService } from "@/domain/servicios/authService";

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
      <Text style={styles.titulo}>Recuperar contraseña</Text>

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
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    gap: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
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