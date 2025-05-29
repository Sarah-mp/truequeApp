import DashboardScreen from '@/components/productospantalla';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function productos() {
  return (
<ScrollView contentContainerStyle={styles.scrollContainer}>
<View style={styles.innerContainer}>
  <DashboardScreen />
</View>
</ScrollView>
);
}

const styles = StyleSheet.create({
scrollContainer: {
flexGrow: 1,
backgroundColor: '#153dda', // Mismo color que el header de LoginScreen
},
innerContainer: {
// Esto es opcional, pero ayuda a mantener la estructura clara
paddingBottom: 10, // Añade algo de espacio al final si es necesario
},
});
