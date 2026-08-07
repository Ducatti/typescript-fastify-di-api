import { describe, it, expect } from 'vitest'
import type { ProductRepository } from '../../application/ports/product.repository.js'
import {
  DomainError,
  InvalidProductError,
} from '../../domain/errors/domain.errors.js'
import { createAppDependencies, createLoggerSpy } from '../../test/fakes.js'
import { buildServer } from './server.js'

class UnmappedDomainError extends DomainError {
  readonly code = 'SOMETHING_NEW'
}

/**
 * Antes o service locator obrigava a mutar o container global e importar o
 * server dinamicamente. Com o grafo recebido por parâmetro, montar um cenário
 * de falha é passar outro repositório.
 */
function buildFailingServer(failure: () => never) {
  const repository: ProductRepository = {
    findAll: async () => failure(),
    findById: async () => failure(),
  }
  const logger = createLoggerSpy()

  return {
    logger,
    app: buildServer(createAppDependencies(repository, logger), {
      logger: false,
    }),
  }
}

describe('error handler', () => {
  it('converte erro inesperado em 500 sem vazar a mensagem interna', async () => {
    const { app, logger } = buildFailingServer(() => {
      throw new Error('falha inesperada no banco')
    })
    const server = await app

    const res = await server.inject({ method: 'GET', url: '/products' })

    expect(res.statusCode).toBe(500)
    expect(res.json()).toEqual({
      error: { statusCode: 500, message: 'Internal Server Error' },
    })
    expect(res.body).not.toContain('falha inesperada no banco')
    expect(logger.error).toHaveBeenCalledOnce()

    await server.close()
  })

  it('usa o status mapeado para o erro de domínio', async () => {
    const server = await buildFailingServer(() => {
      throw new InvalidProductError('id inválido')
    }).app

    const res = await server.inject({ method: 'GET', url: '/products/abc' })

    expect(res.statusCode).toBe(400)
    expect(res.json()).toEqual({
      error: { statusCode: 400, message: 'id inválido' },
    })

    await server.close()
  })

  it('erro de domínio sem mapeamento cai em 500 em vez de status inventado', async () => {
    const server = await buildFailingServer(() => {
      throw new UnmappedDomainError('caso novo')
    }).app

    const res = await server.inject({ method: 'GET', url: '/products' })

    expect(res.statusCode).toBe(500)
    expect(res.body).not.toContain('caso novo')

    await server.close()
  })
})
