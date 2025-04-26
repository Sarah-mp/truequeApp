import * as React from 'react';
import { TextInput } from 'react-native-paper';

const contraseña = () => {
  const [text, setText] = React.useState('');

  return (
    <TextInput
      label="Password"
      secureTextEntry
      right={<TextInput.Icon icon="eye" />}
    />
  );
};

export default contraseña;