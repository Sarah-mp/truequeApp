import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';


export default function MessageCard
 ({ 
  name = "Name Name", 
  message= 'ahahhaha', 
  avatarUrl = '',
  interests = ['interest1', 'interest2', 'interest3', 'interest4']
}) {
  return (
    <View style={styles.fondo}>
    <View style={styles.card}>
      {/* Avatar */}
      <View style={styles.avatarContainer}>
        <Image
          source={
            avatarUrl
              ? { uri: avatarUrl }
              : require('/home/user/trueque/assets/images/avatar23.avif') // Ejemplo de un placeholder
          }
          style={styles.avatar}
        />
      </View>

      {/* Contenido */}
      <View style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.message}>{message}</Text>

        {/* Línea divisoria */}
        <View style={styles.divider} />

        {/* Sección de intereses */}
        <Text style={styles.title}>My Interests</Text>
        <View style={styles.interestsContainer}>
          {interests?.map((interest: string, index: number) => (
            <Text key={index} style={styles.chip}>{interest}</Text>
          ))}
        </View>
      </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fondo: {
   
    backgroundColor: '#380572',
   
  },
  card: {
    margin: 20,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: 'contain',
    

  },
  avatarContainer: {
   
    
  },
  
  content: {
    marginTop: 15,
    alignItems: "center",
    
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  message: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    marginVertical: 8,
    fontFamily: 'poppins',
    
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#ADADAD",
    marginVertical: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  interestsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },

  chip: {
    backgroundColor: "#3A0176",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    margin: 5,
    fontSize: 12,
    fontStyle: 'italic',
    fontFamily:'poppins',
    color: '#fff',
  },
});