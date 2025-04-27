import { Card } from "@/domain/entities/Card";

export interface CardService {
  getCardData(): Promise<Card[]>;
};
