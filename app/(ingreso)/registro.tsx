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
        <Formulario label='Nombre Completo' texto='' outlineColor='#0100FE'  ></Formulario> 
        <Formulario label='Corrreo Institucional' texto='' outlineColor='#0100FE' ></Formulario> 
        <Formulario label='Usuario' texto='' outlineColor='#0100FE' ></Formulario> 
        <Contraseña label='Contraseña'></Contraseña>
        <Boton texto="ÚNETE" colorFondo='#0100FE'></Boton>
        <Botontext></Botontext>
        </View>
        
     </SafeAreaView>
    </View>
  );
}