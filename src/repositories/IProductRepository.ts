
import type { Product } from '../types/product.js'

export interface IProductRepository {
  findAll(): Promise<Product[]>
  findById(id: string): Promise<Product | null>
}