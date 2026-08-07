import type { GetProductUseCase } from '../../../application/use-cases/get-product.usecase.js'
import type { ListProductsUseCase } from '../../../application/use-cases/list-products.usecase.js'
import {
  toProductListResponse,
  toProductResponse,
} from '../presenters/product.presenter.js'
import type {
  ProductListResponse,
  ProductResponse,
} from '../schemas/product.schemas.js'

/**
 * Sem FastifyRequest/FastifyReply na assinatura: o controller recebe dados
 * simples e devolve o DTO de resposta. Amarrar isso ao Fastify é trabalho do
 * arquivo de rotas, que tem uma linha por endpoint.
 */
export class ProductController {
  constructor(
    private readonly listProducts: ListProductsUseCase,
    private readonly getProduct: GetProductUseCase
  ) {}

  async list(): Promise<ProductListResponse> {
    return toProductListResponse(await this.listProducts.execute())
  }

  async getById(id: string): Promise<ProductResponse> {
    return toProductResponse(await this.getProduct.execute({ id }))
  }
}
