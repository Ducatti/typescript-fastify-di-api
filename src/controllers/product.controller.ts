import { injectable, inject } from 'tsyringe'
import type { FastifyRequest, FastifyReply } from 'fastify'
import type { IProductController } from './IProductController.js'
import type { IProductService } from '../services/IProductService.js'
import { PRODUCT_SERVICE_TOKEN } from '../types/tokens.js'

@injectable()
export class ProductController implements IProductController {
  constructor(
    @inject(PRODUCT_SERVICE_TOKEN)
    private readonly service: IProductService
  ) {}

  async list(request: FastifyRequest, reply: FastifyReply): Promise<void> {
    const products = await this.service.listProducts()
    await reply.send({ data: products, total: products.length })
  }

  async getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void> {
    const product = await this.service.getProduct(request.params.id)
    await reply.send({ data: product })
  }
}