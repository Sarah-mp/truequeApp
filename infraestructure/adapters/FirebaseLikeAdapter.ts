import { ILikeRepository } from "@/domain/interfaces/ILikeRepository";
import { Like }            from "@/domain/entities/Like";
import { db }              from "@/config/firebase";
import {
  collection,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

export class FirebaseLikeAdapter implements ILikeRepository {
  private coll = collection(db, "likes");

  async create(like: Like): Promise<void> {
    const ref = doc(this.coll);
    like.id = ref.id;
    await setDoc(ref, {
      productId:  like.productId,
      fromUserId: like.fromUserId,
      toUserId:   like.toUserId,
      createdAt:  like.createdAt.toISOString(),
    });
  }

  async remove(fromUserId: string, productId: string): Promise<void> {
    // buscar todos los docs que coincidan
    const q = query(
      this.coll,
      where("fromUserId", "==", fromUserId),
      where("productId",  "==", productId)
    );
    const snap = await getDocs(q);
    await Promise.all(
      snap.docs.map(d => deleteDoc(doc(db, "likes", d.id)))
    );
  }

  async countForUser(toUserId: string): Promise<number> {
    const q = query(
      this.coll,
      where("toUserId", "==", toUserId)
    );
    const snap = await getDocs(q);
    return snap.size;
  }
}
