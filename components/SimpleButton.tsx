import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

// Definimos un tipo simple para las props
interface ButtonProps {
  title: string;
  onPress: () => void;
}

const SimpleButton: React.FC<ButtonProps> = ({ title, onPress }) => {
  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={onPress} 
      activeOpacity={0.8}
    >
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
});

export default SimpleButton;