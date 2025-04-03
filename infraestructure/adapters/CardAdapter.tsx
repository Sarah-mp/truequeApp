import CardService from '@/application/servicios/CardService';
import { Card } from '@/domain/entities/Card';


export const adaptCard = (CardData: any): Card => ({
    name: CardData.user_name,
    message: CardData.text,
    avatarUrl: CardData.image,
    interests: CardData.hobbies,
});

export const adaptCards = async (): Promise<Card[]> => {
   const rawData = await CardService.getCardData();
   return rawData.map(adaptCard);
};

export default {
    adaptCard,
    adaptCards
};
