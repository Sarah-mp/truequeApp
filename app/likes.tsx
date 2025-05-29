
import LikedProductsScreen from '@/components/megusta';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function olvido() {
    return (
  <ScrollView contentContainerStyle={styles.scrollContainer}>
  <View style={styles.innerContainer}>
    <LikedProductsScreen />
  </View>
</ScrollView>
);
}

const styles = StyleSheet.create({
scrollContainer: {
flexGrow: 1,
backgroundColor: '#ffffff', // Mismo color que el header de LoginScreen
},
innerContainer: {
// Esto es opcional, pero ayuda a mantener la estructura clara
paddingBottom: 40, // Añade algo de espacio al final si es necesario
},
});