import { ReactNode } from "react";

export interface Product {
    ownerName: ReactNode;
    id?: string;
    title: string;
    description: string;
    category: string;
    location: string;
    quantity: number;
    images: string[];
    ownerId: string;
    createdAt: Date;
    updatedAt: Date;
    isActive: boolean;
  }
  