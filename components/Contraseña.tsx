import * as React from 'react';
import { TextInput } from 'react-native-paper';

type propsFormulario = {
  label: string | undefined;
  
}

const contraseña = ({ label }: propsFormulario) => {
  const [text, setText] = React.useState('');

  return (
    <TextInput
      label={label}
      secureTextEntry
      right={<TextInput.Icon icon="eye" />}
    />
  );
};

export default contraseña;