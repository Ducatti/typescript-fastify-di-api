import type { FastifyRequest, FastifyReply } from 'fastify'

export interface IProductController {
  list(request: FastifyRequest, reply: FastifyReply): Promise<void>
  getById(
    request: FastifyRequest<{ Params: { id: string } }>,
    reply: FastifyReply
  ): Promise<void>
}