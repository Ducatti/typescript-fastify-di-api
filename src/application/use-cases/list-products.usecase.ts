import type { Product } from '../../domain/entities/product.js'
import type { Logger } from '../ports/logger.js'
import type { ProductRepository } from '../ports/product.repository.js'

/**
 * Um caso de uso, um `execute`. Sem decorator, sem import de framework:
 * dá para chamar daqui de uma rota HTTP, de um worker ou de um teste,
 * e a montagem fica no composition root (main/container.ts).
 */
export class ListProductsUseCase {
  constructor(
    private readonly products: ProductRepository,
    private readonly logger: Logger
  ) {}

  async execute(): Promise<Product[]> {
    this.logger.debug('Listing all products')
    return this.products.findAll()
  }
}
