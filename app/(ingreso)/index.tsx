import Contraseña from "@/components/Contraseña";
import Formulario from "@/components/Formulario";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Logo from "@/components/logo";
import GeneralBoton from "@/components/GeneralBoton";

export default function HomeScreen() {
  return (
    <View>
      <View style={styles.logoContainer}>
         <Logo
          source={require("@/assets/Icons/Nombre.png")}
          height={100}
          width={100}
        ></Logo>
      </View>

      <SafeAreaView>
        <View style={styles.GeneralContainer}  >
          <View style={{marginTop: 60, marginBottom: 60, gap: 20}} >
            <Formulario
              label="Correo Electrónico"
              texto=""
              outlineColor="#0100FE"
            ></Formulario>  
         
            <Contraseña 
            label="Contraseña"
            ></Contraseña>

            <GeneralBoton
              texto="INICIAR SESIÓN"
              colorFondo="#0100FE"
              colorTexto="#ffffff"
            ></GeneralBoton>

          <View style={styles.BotonesContainer}>
            <GeneralBoton
              texto="¿Olvidó su contraseña?"
              colorFondo="#ffffff"
              colorTexto="#999999"
            ></GeneralBoton>
            <GeneralBoton
              texto="Regístrate"
              colorFondo="#ffffff"
              colorTexto="#999999"
              ruta={"/registro"}
            ></GeneralBoton>
          </View>

          <GeneralBoton
            texto="Continuar con Google"
            colorFondo="#ced4da"
            colorTexto="#999999"
          />
          </View>

          
         
          
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  GeneralContainer:{
  
    display: "flex",
    flexDirection: "column",  
    flex: 1,  
     alignItems: "center",
    justifyContent: "space-evenly", 
    alignContent: "space-around"

  },
  
  logoContainer: {
    width: "100%",
    height: "60%",
    backgroundColor: "#0100FE",
    alignItems: "center",
    justifyContent: "center",
  },

  BotonesContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
  }
});
