import { injectable } from 'tsyringe'
import type { IProductRepository } from './IProductRepository.js'
import type { Product } from '../types/product.js'

@injectable()
export class ProductMemoryRepository implements IProductRepository {
  readonly #products: Product[] = [
    { id: '1', name: 'Teclado mecânico', price: 450.00 },
    { id: '2', name: 'Monitor 27"',      price: 1800.00 },
    { id: '3', name: 'Webcam HD',        price: 320.00 },
  ]

  async findAll(): Promise<Product[]> {
    return this.#products
  }

  async findById(id: string): Promise<Product | null> {
    return this.#products.find(p => p.id === id) ?? null
  }
}