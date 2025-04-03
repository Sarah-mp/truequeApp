import { adaptCards } from '@/infraestructure/adapters/CardAdapter';
import { Card } from '@/domain/entities/Card';

async function getCardData(): Promise<Card[]> {
  try {
    return await adaptCards();
  } catch (error) {
    console.error('Error reading card data:', error);
    return [];
  }
}

export default {
  getCardData,
};