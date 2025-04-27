import GeneralBoton from "@/components/GeneralBoton";
import Contraseña from "@/components/Contraseña";
import Formulario from "@/components/Formulario";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <View>
      <View style={styles.logoContainer}>
         
      </View>
      
      <SafeAreaView>
        <View style={styles.GeneralContainer}>
        <View style={{marginTop: 60, marginBottom: 60, gap: 20}} >
          <Formulario
            label="Nombre Completo"
            texto=""
            outlineColor="#0100FE"
          ></Formulario>
          <Formulario
            label="Corrreo Institucional"
            texto=""
            outlineColor="#0100FE"
          ></Formulario>
          <Formulario
            label="Usuario"
            texto=""
            outlineColor="#0100FE"
          ></Formulario>

          <Contraseña label="Contraseña"></Contraseña>
          
          <GeneralBoton 
          texto="ÚNETE" 
          colorFondo="#0100FE"
          colorTexto="#ffffff"
          ></GeneralBoton>
          
          <GeneralBoton
            colorFondo="#ffffff"
            colorTexto="#0100FE"
            texto="¿Tienes problemas? Contáctanos"
          ></GeneralBoton>

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
    height: "30%",
    backgroundColor: "#0100FE",
    alignItems: "center",
    justifyContent: "center",
  },

});
