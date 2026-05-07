import { injectable, inject } from 'tsyringe'
import type { IProductService } from './IProductService.js'
import type { IProductRepository } from '../repositories/IProductRepository.js'
import type { ILogger } from '../logger/ILogger.js'
import type { Product } from '../types/product.js'
import { LOGGER_TOKEN, PRODUCT_REPOSITORY_TOKEN } from '../types/tokens.js'
import { NotFoundError } from '../types/errors.js'

@injectable()
export class ProductService implements IProductService {
  constructor(
    @inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly repo: IProductRepository,
    @inject(LOGGER_TOKEN)
    private readonly logger: ILogger
  ) {}

  async listProducts(): Promise<Product[]> {
    this.logger.debug('Listing all products')
    return this.repo.findAll()
  }

  async getProduct(id: string): Promise<Product> {
    const product = await this.repo.findById(id)
    if (!product) {
      this.logger.warn('Product does not exist', { id })
      throw new NotFoundError('Produto')
    }
    return product
  }
}