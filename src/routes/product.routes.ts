import type { FastifyPluginAsync } from 'fastify'
import { container } from '../container.js'
import { PRODUCT_CONTROLLER_TOKEN } from '../types/tokens.js'
import type { IProductController } from '../controllers/IProductController.js'

export const productRoutes: FastifyPluginAsync = async (app) => {
  const ctrl = container.resolve<IProductController>(PRODUCT_CONTROLLER_TOKEN)

  app.get('/', (req, reply) => ctrl.list(req, reply))

  app.get<{ Params: { id: string } }>(
    '/:id',
    (req, reply) => ctrl.getById(req, reply)
  )
}