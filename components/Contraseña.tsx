import * as React from 'react';
import { TextInput } from 'react-native-paper';

type propsContraseña = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  outlineColor?: string; 
};

const Contraseña = ({ label, value, onChangeText, outlineColor }: propsContraseña) => {
  return (
    <TextInput
      label={label}
      mode="outlined"
      secureTextEntry
      value={value}
      onChangeText={onChangeText}
      outlineColor={outlineColor} 
      right={<TextInput.Icon icon="eye" />}
    />
  );
};


export default Contraseña;