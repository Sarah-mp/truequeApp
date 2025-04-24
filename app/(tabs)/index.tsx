import { StyleSheet, View } from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import MessageCard from '@/components/MessageCard';
import { useEffect, useState } from 'react';
import { Card } from '@/domain/entities/Card';
import CardService from '@/application/servicios/CardService';

export default function HomeScreen() {
  const [cardData, setCardData] = useState<Card | null>(null); // Assuming Card interface

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await CardService.getCardData();
        if (data && data.length > 0) {
          setCardData(data[0]); // Assuming you want to display the first card
        }
      } catch (error) {
        console.error("Error fetching card data:", error);
      }

    };
    fetchData();
  }, []);
  return (
    <View>
      {cardData ? (
        <MessageCard
          name={cardData.name}
          message={cardData.message}
          avatarUrl={cardData.avatarUrl}
          interests={cardData.interests}
        />
      ) : (
        <ThemedText>Loading card...</ThemedText> // Or some default content
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  cajon: {

    borderColor: '#2a1e5c',
    borderWidth: 5,
    backgroundAttachment: 'center',
    borderRadius: 20,
    width: 200,
    height: 100,
    borderStyle: 'solid',
    backgroundColor: '#D4D9D8',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',


  },
});