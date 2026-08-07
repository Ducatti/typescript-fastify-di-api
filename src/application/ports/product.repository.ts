import type { Product } from '../../domain/entities/product.js'

/**
 * Port: contrato que a aplicação EXIGE. Mora aqui, e não junto da
 * implementação, porque quem é dono da interface é a camada de dentro.
 * Adaptadores vivem em infrastructure/persistence/.
 */
export interface ProductRepository {
  findAll(): Promise<Product[]>
  findById(id: string): Promise<Product | null>
}
