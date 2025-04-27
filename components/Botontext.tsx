import * as React from 'react';
import { Button } from 'react-native-paper';


type propsBotontext = {
  texto: string | undefined;
    colorFondo: string | undefined;
    colorTexto?: string | undefined;
   

}
const botontext = ({ texto, colorFondo, colorTexto }: propsBotontext) => (

  <Button icon="camera" mode="text" buttonColor={colorFondo} textColor={colorTexto} onPress={() => console.log('Pressed')}>
    {texto}
   

  </Button>
);

export default botontext;

