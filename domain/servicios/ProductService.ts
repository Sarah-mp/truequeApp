import { Product } from "../entities/Product";
import { IProductRepository } from "../interfaces/IProduct";

export class ProductService {
  register(product: Product) {
    throw new Error("Method not implemented.");
  }
  constructor(private readonly repo: IProductRepository) {}

  async registerProduct(product: Product): Promise<void> {
    product.createdAt = new Date();
    product.updatedAt = new Date();
    product.isActive = true;

    await this.repo.register(product);
  }

  async deleteProduct(productId: string): Promise<void> {
    await this.repo.delete(productId);
  }

}
