import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import type { FastifyPluginAsync } from 'fastify'
import type { ProductController } from '../controllers/product.controller.js'
import {
  ErrorResponseSchema,
  ProductListResponseSchema,
  ProductParamsSchema,
  ProductResponseSchema,
} from '../schemas/product.schemas.js'

/**
 * Recebe o controller por parâmetro em vez de resolvê-lo de um container
 * global. Quem monta o grafo é o composition root (main/container.ts).
 */
export function productRoutes(
  controller: ProductController
): FastifyPluginAsync {
  return async app => {
    const routes = app.withTypeProvider<TypeBoxTypeProvider>()

    // '' (e não '/') para o path no OpenAPI sair como `/products`
    routes.get(
      '',
      {
        schema: {
          tags: ['products'],
          summary: 'Listar produtos',
          response: { 200: ProductListResponseSchema },
        },
      },
      () => controller.list()
    )

    routes.get(
      '/:id',
      {
        schema: {
          tags: ['products'],
          summary: 'Buscar produto por ID',
          params: ProductParamsSchema,
          response: {
            200: ProductResponseSchema,
            404: ErrorResponseSchema,
          },
        },
      },
      req => controller.getById(req.params.id)
    )
  }
}
