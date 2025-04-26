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
        <Formulario></Formulario> 
        <Contraseña></Contraseña>
        <Boton></Boton>
        <Botontext></Botontext>
        <Boton></Boton>
        </View>
        
     </SafeAreaView>
    </View>
  );
}