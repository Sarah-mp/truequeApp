import React, { useState } from 'react';
import { TextInput } from 'react-native-paper';

type PropsContraseña = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  outlineColor?: string;
};

const Contraseña = ({ label, value, onChangeText, outlineColor }: PropsContraseña) => {
  const [visible, setVisible] = useState(false);

  return (
    <TextInput
      label={label}
      mode="outlined"
      value={value}
      onChangeText={onChangeText}
      secureTextEntry={!visible}
      outlineColor={outlineColor}
      right={
        <TextInput.Icon
          icon={visible ? 'eye-off' : 'eye'}
          onPress={() => setVisible(!visible)}
        />
      }
      style={{ backgroundColor: '#F5F5F5', borderRadius: 12 }}
    />
  );
};

export default Contraseña;
