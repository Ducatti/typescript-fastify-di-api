import type { FastifyPluginAsync } from 'fastify'

interface HealthReply {
  status: 'ok'
  uptime: number
  timestamp: string
  version: string
}

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get<{ Reply: HealthReply }>('/health', {
    schema: {
      tags: ['health'],
      summary: 'Verificar status da aplicação',
      response: {
        200: {
          type: 'object',
          properties: {
            status: { type: 'string', enum: ['ok'] },
            uptime: { type: 'number' },
            timestamp: { type: 'string', format: 'date-time' },
            version: { type: 'string' },
          },
          required: ['status', 'uptime', 'timestamp', 'version'],
        },
      },
    },
    handler: async (_req, reply) => {
      return reply.send({
        status: 'ok',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
        version: process.env.npm_package_version ?? '0.0.1',
      })
    },
  })
}