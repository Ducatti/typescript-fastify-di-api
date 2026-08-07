import { vi } from 'vitest'
import type { FastifyReply, FastifyRequest } from 'fastify'
import type { ILogger } from '../logger/ILogger.js'
import type { IProductRepository } from '../repositories/IProductRepository.js'
import type { Product } from '../types/product.js'

/** Logger espionável — nenhuma saída, mas dá para assertar as chamadas. */
export function createLoggerSpy(): ILogger {
  return {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  }
}

/** Repositório em memória controlável pelo teste, sem tocar na implementação real. */
export function createProductRepositoryStub(
  products: Product[] = []
): IProductRepository {
  return {
    findAll: vi.fn(async () => products),
    findById: vi.fn(async (id: string) => products.find(p => p.id === id) ?? null),
  }
}

/**
 * Mínimo de FastifyReply para testar controllers isoladamente.
 * `sent` guarda o último payload para as asserções.
 */
export function createReplyStub() {
  const reply = {
    sent: undefined as unknown,
    send: vi.fn(async (payload: unknown) => {
      reply.sent = payload
      return reply
    }),
  }
  return reply as typeof reply & FastifyReply
}

/** FastifyRequest com apenas o que o controller lê. */
export function createRequestStub<T extends object>(partial: T): FastifyRequest & T {
  return partial as FastifyRequest & T
}

export const PRODUCT_FIXTURES: Product[] = [
  { id: '1', name: 'Teclado mecânico', price: 450 },
  { id: '2', name: 'Monitor 27"', price: 1800 },
]
