import { IProductRepository } from "@/domain/interfaces/IProduct";
import { Product } from "@/domain/entities/Product";
import { db } from "@/config/firebase";
import { collection, deleteDoc, doc, getDoc, getFirestore, setDoc } from "firebase/firestore";

export class FirebaseProductAdapter implements IProductRepository {
  async getById(id: string): Promise<Product | null> {
    const db = getFirestore();
    const docRef = doc(db, "productos", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    }
    return null;
  }
  
   
  async register(product: Product): Promise<void> {

    const ref = doc(collection(db, "productos"));
    product.id = ref.id;

    await setDoc(ref, {
      ...product,
      createdAt: product.createdAt.toISOString(),
      updatedAt: product.updatedAt.toISOString()
    });
  }

  async delete(productId: string): Promise<void> {
    const ref = doc(db, 'productos', productId);
    await deleteDoc(ref);
  }

}
