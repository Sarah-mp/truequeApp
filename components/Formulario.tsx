import * as React from 'react';
import { TextInput } from 'react-native-paper';

type propsFormulario = {
  texto?: string | undefined;
  label: string | undefined;
  outlineColor: string | undefined;
}

const formulario = ({ texto, label,outlineColor }: propsFormulario) => {
    const [text, setText] = React.useState(texto);
  return (
    <TextInput
    mode="outlined"
    outlineColor={outlineColor}
    label={label}
    value={text}
      onChangeText={text => setText(text)}
    />
  );
};

export default formulario;