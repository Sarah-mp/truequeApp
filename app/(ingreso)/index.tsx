import Boton from '@/components/Boton';
import Botontext from '@/components/Botontext';
import Contraseña from '@/components/Contraseña';
import Formulario from '@/components/Formulario';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import '../../assets/Style.css';


export default function HomeScreen() {
 
    
        return (
    <View >
   
      <Text >TrueQ U</Text>
      <SafeAreaView>
        <View>
        <Formulario label='Correo Electrónico' texto='Correo' outlineColor='#0100FE'   ></Formulario> 
        <Contraseña></Contraseña>
        <Link href={"/registro"}><Boton texto="INICIAR SESIÓN" colorFondo='#4361ee'></Boton></Link>
        <Botontext></Botontext>
        <Boton texto="Continuar con Google" colorFondo='#ced4da'> </Boton>
        </View>
        
     </SafeAreaView>
    </View>
  );
}