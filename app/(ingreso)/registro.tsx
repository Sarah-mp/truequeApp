import { useState } from "react";
import React from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Formulario from "@/components/Formulario";
import Contraseña from "@/components/Contraseña";
import GeneralBoton from "@/components/GeneralBoton";
import { AuthService } from "@/domain/servicios/authService";
import { User } from "@/domain/entities/User";
import { router } from "expo-router";

export default function RegistroScreen() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    username?: string;
    password?: string;
  }>({});
  const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

  const handleRegister = async () => {
    setErrorMessage("");
    const newErrors: typeof errors = {};

    if (!fullName.trim()) newErrors.fullName = "El nombre completo es obligatorio";
    if (!email.trim()) {
      newErrors.email = "El correo electrónico es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Correo electrónico inválido";
    }
  
    if (!username.trim()) newErrors.username = "El usuario es obligatorio";
  
    if (!password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    } else if (!strongPasswordRegex.test(password)) {
      newErrors.password =
        "Debe contener mayúscula, minúscula, número y símbolo";
    }    
  
    setErrors(newErrors);
  
    if (Object.keys(newErrors).length > 0) return;
  

    const newUser: User = {
      id: "",
      email,
      password,
      displayName: fullName,
      username,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  
    try {
      await AuthService.register(newUser);
      router.replace("/(tabs)");
    } catch (error: any) {
      setErrorMessage(error.message || "Error al registrar usuario");
    }
  };

  return (
    <View>
      <View style={styles.logoContainer} />

      <SafeAreaView>
        <View style={styles.GeneralContainer}>
          <View style={{ marginTop: 60, marginBottom: 60, gap: 20 }}>
          <Formulario
            label="Nombre Completo"
            texto={fullName}
            onChangeText={setFullName}
            outlineColor={errors.fullName ? "red" : "#0100FE"}
          />
          {errors.fullName && <Text style={styles.errorText}>{errors.fullName}</Text>}

          <Formulario
            label="Correo Institucional"
            texto={email}
            onChangeText={setEmail}
            outlineColor={errors.email ? "red" : "#0100FE"}
          />
          {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

          <Formulario
            label="Usuario"
            texto={username}
            onChangeText={setUsername}
            outlineColor={errors.username ? "red" : "#0100FE"}
          />
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

          <Contraseña
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            outlineColor={errors.password ? "red" : "#0100FE"}
          />
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
            <GeneralBoton
              texto="ÚNETE"
              colorFondo="#0100FE"
              colorTexto="#ffffff"
              onPress={handleRegister}
            />

            {errorMessage ? (
              <Text style={{ color: "red", textAlign: "center" }}>{errorMessage}</Text>
            ) : null}

            <GeneralBoton
              colorFondo="#ffffff"
              colorTexto="#0100FE"
              texto="¿Tienes problemas? Contáctanos"
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  GeneralContainer: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
    justifyContent: "space-evenly",
    alignContent: "space-around",
  },
  logoContainer: {
    width: "100%",
    height: "30%",
    backgroundColor: "#0100FE",
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    color: "red",
    marginTop: 2,
    marginLeft: 8,
    fontSize: 12,
  },
  
});