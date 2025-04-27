import { Card } from "../entities/Card";

export const adaptCard = (CardData: any): Card => ({
    name: CardData.user_name,
    message: CardData.text,
    avatarUrl: CardData.image,
    interests: CardData.hobbies,
});