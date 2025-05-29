// infraestructure/adapters/FirebaseUserAdapter.ts
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/config/firebase";

export class FirebaseUserAdapter {
  async getById(userId: string): Promise<{ id: string; fullName: string } | null> {
    const docRef = doc(db, "Usuario", userId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) return null;

    const data = docSnap.data();
    return {
      id: docSnap.id,
      fullName: data.fullName || "Usuario",
    };
  }
}
