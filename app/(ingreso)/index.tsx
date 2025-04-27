import Contraseña from "@/components/Contraseña";
import Formulario from "@/components/Formulario";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "@/components/logo";
import Boton from "@/components/Boton";
import GeneralBoton from "@/components/GeneralBoton";

export default function HomeScreen() {
  return (
    <View>
      <View style={styles.logoContainer}>
        <Logo source={require("@/assets/iconos/hamburguesa.png")}></Logo>
        <Logo
          source={require("@/assets/iconos/hamburguesa.png")}
          height={30}
          width={30}
          style={styles.logoStyles}
        ></Logo>
        <Logo></Logo>
      </View>
      <SafeAreaView>
        <View>
          <View>
            <Formulario
              label="Correo Electrónico"
              texto=""
              outlineColor="#0100FE"
            ></Formulario>
            <Contraseña label="Contraseña"></Contraseña>
          </View>
          <View className="iniciose">
            <GeneralBoton
              texto="INICIAR SESIÓN"
              colorFondo="#999999"
              colorTexto="#0100FE"
            ></GeneralBoton>
          </View>
          <View>
            <GeneralBoton
              texto="¿Olvidó su contraseña?"
              colorFondo="#999999"
              colorTexto="#0100FE"
            ></GeneralBoton>
            <GeneralBoton
              texto="Regístrate"
              colorFondo="#999999"
              colorTexto="#0100FE"
              ruta={"/registro"}
            ></GeneralBoton>
          </View>
          <Boton
            colorTexto=""
            texto="Continuar con Google"
            colorFondo="#ced4da"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    width: "100%",
    height: "auto",
    backgroundColor: "cyan",
    alignItems: "center",
    justifyContent: "center",
  },
  logoStyles: {
    backgroundColor: "yellow",
    borderRadius: "1rem",
  },
});
