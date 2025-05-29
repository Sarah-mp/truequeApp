import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconButton } from "react-native-paper";
import { useRouter } from "expo-router";
import Formulario from "@/components/Formulario";
import Contraseña from "@/components/Contraseña";
import GeneralBoton from "@/components/GeneralBoton";
import { AuthService } from "@/domain/servicios/authService";
import { User } from "@/domain/entities/User";
import Logo from "@/components/logo";

export default function RegistroScreen() {
  const router = useRouter();

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

  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

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
      updatedAt: new Date(),
    };

    try {
      await AuthService.register(newUser);
      router.replace("/productos");
    } catch (error: any) {
      setErrorMessage(error.message || "Error al registrar usuario");
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <IconButton
          icon="arrow-left"
          iconColor="white"
          size={28}
          onPress={() => router.navigate("/")}
        />

       
        <View style={styles.header}>
          <Logo
            source={require("@/assets/Icons/Nombre.png")}
            height={100}
            width={100}
          />
        </View>

        {/* Formulario con scroll y keyboard avoid */}
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formBackground}>
              <View style={styles.formContainer}>
                <Text style={styles.titulo}>Registro</Text>

                <Formulario
                  label="Nombre Completo"
                  texto={fullName}
                  onChangeText={setFullName}
                  outlineColor={errors.fullName ? "red" : "#0100FE"}
                />
                {errors.fullName && (
                  <Text style={styles.errorText}>{errors.fullName}</Text>
                )}

                <Formulario
                  label="Correo Institucional"
                  texto={email}
                  onChangeText={setEmail}
                  outlineColor={errors.email ? "red" : "#0100FE"}
                />
                {errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                <Formulario
                  label="Usuario"
                  texto={username}
                  onChangeText={setUsername}
                  outlineColor={errors.username ? "red" : "#0100FE"}
                />
                {errors.username && (
                  <Text style={styles.errorText}>{errors.username}</Text>
                )}

                <Contraseña
                  label="Contraseña"
                  value={password}
                  onChangeText={setPassword}
                  outlineColor={errors.password ? "red" : "#0100FE"}
                />
                {errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                <GeneralBoton
                  texto="ÚNETE"
                  colorFondo="#0100FE"
                  colorTexto="#ffffff"
                  onPress={handleRegister}
                />

                {errorMessage ? (
                  <Text style={{ color: "red", textAlign: "center" }}>
                    {errorMessage}
                  </Text>
                ) : null}

                <GeneralBoton
                  colorFondo="#ffffff"
                  colorTexto="#0100FE"
                  texto="¿Tienes problemas? Contáctanos"
                />
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0100FE",
  },
  backButton: {
    position: "absolute",
    top: 15,
    left: 10,
    zIndex: 100,
  },
  header: {
    height: "40%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0100FE",
  },
  scroll: {
    flex: 1,
    backgroundColor: "#0100FE",
  },
  scrollContent: {
    flexGrow: 1,
  },
  formBackground: {
    backgroundColor: "#F5F5F5",
    borderTopRightRadius: 40,
    paddingTop: 40,
    paddingBottom: 60,
    paddingHorizontal: 20,
    minHeight: "100%",
  },
  formContainer: {
    gap: 20,
    width: "100%",
    maxWidth: 400,
    alignSelf: "center",
  },
  errorText: {
    color: "red",
    marginTop: 2,
    marginLeft: 8,
    fontSize: 12,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "#0100FE",
  },

});
