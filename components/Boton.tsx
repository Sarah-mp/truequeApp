import { Link } from 'expo-router';
import * as React from 'react';
import { Button } from 'react-native-paper';

type propsBoton = {
    texto: string | undefined;
    colorFondo: string | undefined;
    colorTexto?: string | undefined;
}

const boton = ({ texto, colorFondo, colorTexto }: propsBoton) => (
  <Button icon="camera" mode="contained" buttonColor={colorFondo} onPress={() => console.log('Pressed')}>
    {texto}
  </Button>
);

export default boton;