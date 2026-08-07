import type { ProductRepository } from '../../application/ports/product.repository.js'
import { createProduct, type Product } from '../../domain/entities/product.js'

/**
 * Adaptador de saída. Implementa o port sem que a aplicação saiba que
 * existe — a ligação acontece só no composition root.
 */
export class ProductMemoryRepository implements ProductRepository {
  readonly #products: Product[] = [
    createProduct({ id: '1', name: 'Teclado mecânico', price: 450.0 }),
    createProduct({ id: '2', name: 'Monitor 27"', price: 1800.0 }),
    createProduct({ id: '3', name: 'Webcam HD', price: 320.0 }),
  ]

  async findAll(): Promise<Product[]> {
    return [...this.#products]
  }

  async findById(id: string): Promise<Product | null> {
    return this.#products.find(p => p.id === id) ?? null
  }
}
