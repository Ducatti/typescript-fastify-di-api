
import './container.js'                 // garante que o DI é configurado antes de tudo
import Fastify from 'fastify'
import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import { healthRoutes } from './routes/health.routes.js'
import { productRoutes } from './routes/product.routes.js'
import { AppError } from './types/errors.js'
import {
  productSchema,
  productListResponseSchema,
  errorResponseSchema,
} from './schemas/shared.schemas.js'

export async function buildServer() {
  const app = Fastify({ logger: true })

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Fastify DI API',
        description: 'Template de API Fastify com Dependency Injection',
        version: process.env.npm_package_version ?? '1.0.0',
      },
      tags: [
        { name: 'health', description: 'Verificação de saúde da aplicação' },
        { name: 'products', description: 'Gerenciamento de produtos' },
      ],
    },
  })

  await app.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  })

  app.addSchema(productSchema)
  app.addSchema(productListResponseSchema)
  app.addSchema(errorResponseSchema)

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