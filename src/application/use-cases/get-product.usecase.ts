import type { Product } from '../../domain/entities/product.js'
import { ProductNotFoundError } from '../../domain/errors/domain.errors.js'
import type { Logger } from '../ports/logger.js'
import type { ProductRepository } from '../ports/product.repository.js'

export interface GetProductInput {
  id: string
}

export class GetProductUseCase {
  constructor(
    private readonly products: ProductRepository,
    private readonly logger: Logger
  ) {}

  async execute({ id }: GetProductInput): Promise<Product> {
    const product = await this.products.findById(id)

    if (!product) {
      this.logger.warn('Product does not exist', { id })
      throw new ProductNotFoundError(id)
    }

    return product
  }
}
