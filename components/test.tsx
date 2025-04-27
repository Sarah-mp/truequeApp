import React from 'react';
import { View, Alert, StyleSheet } from 'react-native';
import SimpleButton from '@/components/SimpleButton';

const MiComponente = () => {
  const handlePress = () => {
    Alert.alert('Éxito', '¡El botón funciona correctamente!');
    // O cualquier otra acción que quieras realizar
  };

  return (
    <View style={styles.container}>
      <SimpleButton 
        title="Presionar" 
        onPress={handlePress} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default MiComponente;