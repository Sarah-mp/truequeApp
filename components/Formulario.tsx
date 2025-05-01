import * as React from 'react';
import { TextInput } from 'react-native-paper';

type propsFormulario = {
  texto?: string;
  label: string;
  outlineColor: string;
  onChangeText?: (text: string) => void;
}

const Formulario = ({ texto, label, outlineColor, onChangeText }: propsFormulario) => {
  return (
    <TextInput
      mode="outlined"
      outlineColor={outlineColor}
      label={label}
      value={texto}
      onChangeText={onChangeText}
    />
  );
};

export default Formulario;