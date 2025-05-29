import { Product } from '../entities/Product';

export interface IProductRepository {
  register(product: Product): Promise<void>;
  delete(productId: string): Promise<void>;
}
