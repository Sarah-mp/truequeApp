import * as React from 'react';
import { TextInput } from 'react-native-paper';

type propsFormulario = {
  texto: string | undefined;
  label: string | undefined;
}

const formulario = ({ texto, label }: propsFormulario) => {
    const [text, setText] = React.useState(texto);
  return (
    <TextInput
    mode="outlined"
    outlineColor="#ffffff"
    label={label}
    value={text}
    />
  );
};

export default formulario;