import type { FastifyPluginAsync } from 'fastify'

interface HealthReply {
  status: 'ok'
  uptime: number
  timestamp: string
  version: string
}

export const healthRoutes: FastifyPluginAsync = async (app) => {
  app.get<{ Reply: HealthReply }>('/health', async (_req, reply) => {
    return reply.send({
      status: 'ok',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '0.0.1',
    })
  })
}