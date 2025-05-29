import AddProductScreen from '@/components/registroproducto';
import { router } from 'expo-router';
import { View, Text, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { IconButton } from "react-native-paper";
export default function registroproducto() {

  return (
    <SafeAreaView style={styles.container}>
      <IconButton
          icon="arrow-left"
          iconColor="white"
          size={28}
          onPress={() => router.navigate("/productos")}
        />
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.innerContainer}>
        <AddProductScreen />
      </View>
    </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    backgroundColor: "#0100FE",
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: '#ffffff', // Mismo color que el header de LoginScreen
  },
  innerContainer: {
    // Esto es opcional, pero ayuda a mantener la estructura clara
    paddingBottom: 40, // Añade algo de espacio al final si es necesario
  },
});