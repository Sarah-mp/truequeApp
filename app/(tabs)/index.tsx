import { Image, StyleSheet, Platform, View } from 'react-native';

import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MessageCard from '@/components/MessageCard';

export default function HomeScreen() {
  return (
    <View>

    <MessageCard
    name="Aura"  
    message="I live in the shadow that determines me, I sleep and wake in your essential dawn:Sweet as grapes, and terrible, conductor of sugar and punishment,soaked in the water of your species, suckled in the blood of your heritage." 
    avatarUrl='https://img.freepik.com/vector-gratis/cute-girl-gaming-holding-joystick-cartoon-icon-illustration-concepto-icono-tecnologia-personas-aislado-estilo-dibujos-animados-plana_138676-2169.jpg?t=st=1740454915~exp=1740458515~hmac=f2eab3f8cc0e507454ac0978729c75674289771779c59e5993a0a9300777462d&w=740'
    interests={['Music', 'Food', 'Culture', 'Drinks', 'Sport', 'Travel', 'Fun', 'Business', 'Art']}> 
    </MessageCard>

   
     
    </View>
  );
}

const styles = StyleSheet.create({
  cajon: {
   
    borderColor: '#2a1e5c',
    borderWidth: 5,
    backgroundAttachment: 'center',
    borderRadius: 10,
    width: 200,
    height: 100,
    borderStyle: 'solid',
    backgroundColor: '#D4D9D8',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    
  
  },
});