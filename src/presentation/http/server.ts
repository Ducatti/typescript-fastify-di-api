import fastifySwagger from '@fastify/swagger'
import fastifySwaggerUi from '@fastify/swagger-ui'
import Fastify, { type FastifyServerOptions } from 'fastify'
import type { Logger } from '../../application/ports/logger.js'
import type { GetProductUseCase } from '../../application/use-cases/get-product.usecase.js'
import type { ListProductsUseCase } from '../../application/use-cases/list-products.usecase.js'
import { ProductController } from './controllers/product.controller.js'
import { internalError, mapClientError, mapDomainError } from './error-mapper.js'
import { healthRoutes } from './routes/health.routes.js'
import { productRoutes } from './routes/product.routes.js'
import { sharedSchemas } from './schemas/product.schemas.js'

/**
 * Tudo que o adaptador HTTP precisa, recebido de fora. Nenhum
 * `container.resolve()` aqui dentro — trocar uma dependência num teste é
 * passar outro objeto, não mexer em estado global.
 */
export interface AppDependencies {
  logger: Logger
  listProducts: ListProductsUseCase
  getProduct: GetProductUseCase
}

export interface BuildServerOptions {
  /** Desligue nos testes (`logger: false`) para não poluir a saída. */
  logger?: FastifyServerOptions['logger']
}

export async function buildServer(
  deps: AppDependencies,
  { logger = true }: BuildServerOptions = {}
) {
  const app = Fastify({ logger })

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
    // Sem isto o plugin nomeia os components como def-0, def-1...
    refResolver: {
      buildLocalReference: (json, _baseUri, _fragment, i) =>
        typeof json.$id === 'string' ? json.$id : `def-${i}`,
    },
  })

  await app.register(fastifySwaggerUi, { routePrefix: '/docs' })

  for (const schema of sharedSchemas) {
    app.addSchema(schema)
  }

  app.setErrorHandler((error, request, reply) => {
    const mapped = mapDomainError(error) ?? mapClientError(error)
    if (mapped) {
      return reply.status(mapped.statusCode).send(mapped.body)
    }

    deps.logger.error('Unhandled error', { url: request.url, err: String(error) })
    const fallback = internalError()
    return reply.status(fallback.statusCode).send(fallback.body)
  })

  const productController = new ProductController(
    deps.listProducts,
    deps.getProduct
  )

  await app.register(healthRoutes)
  await app.register(productRoutes(productController), { prefix: '/products' })

  return app
}
