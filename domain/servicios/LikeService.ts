import { ILikeRepository } from "@/domain/interfaces/ILikeRepository";
import { Like }            from "@/domain/entities/Like";

export class LikeService {
  constructor(private repo: ILikeRepository) {}

  /** agrega un like */
  addLike(like: Like): Promise<void> {
    return this.repo.create(like);
  }
  /** quita un like */
  removeLike(fromUserId: string, productId: string): Promise<void> {
    return this.repo.remove(fromUserId, productId);
  }
  /** cuenta likes para un usuario destino */
  countLikesForUser(toUserId: string): Promise<number> {
    return this.repo.countForUser(toUserId);
  }
}
