import { Like } from "../entities/Like";

export interface ILikeRepository {
  /** Crea un nuevo like */
  create(like: Like): Promise<void>;
  /** Elimina el like dado por fromUserId a productId */
  remove(fromUserId: string, productId: string): Promise<void>;
  /** Cuenta cuántos likes recibió el usuario 'toUserId' */
  countForUser(toUserId: string): Promise<number>;
}
