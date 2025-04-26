import Boton from '@/components/Boton';
import Botontext from '@/components/Botontext';
import Contraseña from '@/components/Contraseña';
import Formulario from '@/components/Formulario';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



export default function HomeScreen() {
 
    
        return (
    <View >
   
      <Text >TrueQ U</Text>
      <SafeAreaView>
        <View>
        <Formulario label='Nombre Completo' texto='Ingrese aquí su nombre completo'  ></Formulario> 
        <Formulario label='Corrreo Institucional' texto='Ingrese aquí su Correo Institucional' ></Formulario> 
        <Formulario label='Usuario' texto='Ingrese aquí su usuario' ></Formulario> 
        <Contraseña></Contraseña>
        <Boton texto="ÚNETE" colorFondo='#0100FE'></Boton>
        <Botontext></Botontext>
        </View>
        
     </SafeAreaView>
    </View>
  );
}