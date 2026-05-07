
import type { Product } from '../types/product.js'

export interface IProductService {
  listProducts(): Promise<Product[]>
  getProduct(id: string): Promise<Product>
}