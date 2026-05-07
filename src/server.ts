
import './container.js'                 // garante que o DI é configurado antes de tudo
import Fastify from 'fastify'
import { healthRoutes } from './routes/health.routes.js'
import { productRoutes } from './routes/product.routes.js'
import { AppError } from './types/errors.js'

export async function buildServer() {
  const app = Fastify({ logger: true })

  app.setErrorHandler((error, request, reply) => {
    
    if (error instanceof AppError) {
      return reply.status(error.statusCode).send({
        error: { statusCode: error.statusCode, message: error.message },
      })
    }

    app.log.error({ err: error, url: request.url }, 'Unhandled error')
    return reply.status(500).send({
      error: { statusCode: 500, message: 'Internal Server Error' },
    })
  })

  await app.register(healthRoutes)
  await app.register(productRoutes, { prefix: '/products' })

  return app
}