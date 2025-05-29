import * as React from "react";
import { Button } from "react-native-paper";
import { Text } from 'react-native-paper';

type propsBoton = {
  label: string | undefined;

};

const Boton = ({ label}: propsBoton) => (
 
  <Text variant="titleMedium">{label}</Text>
  
  
  
);

export default Boton;
