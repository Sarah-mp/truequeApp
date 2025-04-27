// TestFirestore.tsx
import React, { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import  db  from 'firebase/database';

const TestFirestore = () => {
  const [status, setStatus] = useState('Sin probar');

  const probarConexion = () => {
    // Simplemente verificamos si el objeto db existe
    if (db) {
      console.log("Objeto db:", db);
      setStatus('✅ Objeto db existe');
    } else {
      console.log("Error: El objeto db no existe");
      setStatus('❌ Error: Objeto db no existe');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prueba Básica de Firestore</Text>
      <Text style={styles.status}>Estado: {status}</Text>
      <Button title="Probar" onPress={probarConexion} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    marginVertical: 15,
  }
});



export default TestFirestore;