import type { FastifyPluginAsync } from 'fastify'
import { container } from '../container.js'
import { PRODUCT_CONTROLLER_TOKEN } from '../types/tokens.js'
import type { IProductController } from '../controllers/IProductController.js'

export const productRoutes: FastifyPluginAsync = async (app) => {
  const ctrl = container.resolve<IProductController>(PRODUCT_CONTROLLER_TOKEN)

  // '' (e não '/') para o path no OpenAPI sair como `/products` em vez de `/products/`
  app.get('', {
    schema: {
      tags: ['products'],
      summary: 'Listar produtos',
      response: {
        200: { $ref: 'ProductListResponse#' },
      },
    },
    handler: (req, reply) => ctrl.list(req, reply),
  })

  app.get<{ Params: { id: string } }>('/:id', {
    schema: {
      tags: ['products'],
      summary: 'Buscar produto por ID',
      params: {
        type: 'object',
        properties: {
          id: { type: 'string', description: 'ID do produto' },
        },
        required: ['id'],
      },
      response: {
        200: { $ref: 'ProductResponse#' },
        404: { $ref: 'ErrorResponse#' },
      },
    },
    handler: (req, reply) => ctrl.getById(req, reply),
  })
}