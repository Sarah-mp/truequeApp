import Boton from '@/components/Boton';
import Botontext from '@/components/Botontext';
import Contraseña from '@/components/Contraseña';
import Formulario from '@/components/Formulario';
import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Logo from '@/components/logo';


export default function HomeScreen() {
 
    
        return (
    <View >
   <View className='logo' >
      <Logo ></Logo>
      </View>
      <SafeAreaView>
        <View>
         <View>
        <Formulario label='Correo Electrónico' texto='' outlineColor='#0100FE'   ></Formulario> 
        <Contraseña label='Contraseña'></Contraseña>
        </View>
         <View className="iniciose">
 <Link href={"/registro"}><Boton  texto="INICIAR SESIÓN" colorFondo='#0100FE'></Boton></Link>
        </View>
        <View>
        <Botontext texto="¿Olvidó su contraseña?" colorFondo='#999999' colorTexto='#0100FE'></Botontext>
        <Botontext texto="Regístrate" colorFondo='#999999' colorTexto='#0100FE'></Botontext>
        </View>
        <Boton  texto="Continuar con Google" colorFondo='#ced4da'> </Boton>
        </View>
        
     </SafeAreaView>
    </View>
  );
}