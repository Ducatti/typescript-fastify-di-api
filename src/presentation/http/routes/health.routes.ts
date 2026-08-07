import type { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import type { FastifyPluginAsync } from 'fastify'
import { HealthResponseSchema } from '../schemas/product.schemas.js'

export const healthRoutes: FastifyPluginAsync = async app => {
  app.withTypeProvider<TypeBoxTypeProvider>().get(
    '/health',
    {
      schema: {
        tags: ['health'],
        summary: 'Verificar status da aplicação',
        response: { 200: HealthResponseSchema },
      },
    },
    async () => ({
      status: 'ok' as const,
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '0.0.1',
    })
  )
}
