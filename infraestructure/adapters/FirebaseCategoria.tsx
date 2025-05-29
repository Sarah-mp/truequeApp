// src/infraestructure/adapters/FirebaseCategoryAdapter.ts
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';
import type { Category } from '@/domain/entities/Categoria';

export class FirebaseCategoryAdapter {
  async list(): Promise<Category[]> {
    const snap = await getDocs(collection(db, 'categorias'));
    return snap.docs.map(doc => ({
      id: doc.id,
      name: (doc.data() as { name: string }).name
    }));
  }
}
