import { adaptCard } from '@/domain/servicios/adaptCard';
import { Card } from '@/domain/entities/Card';

export class CardData {
  static getCardData(): Promise<Card[]> {
    return fetch('https://jsonplaceholder.typicode.com/posts').then(
      (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      },
    ).then((data) => {
      return data.map((item: any) => adaptCard(item));
    });
  }
}

export default CardData;