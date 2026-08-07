import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { container } from './container.js'
import { PRODUCT_SERVICE_TOKEN } from './types/tokens.js'
import type { IProductService } from './services/IProductService.js'
import { ValidationError } from './types/errors.js'

// Arquivo separado de propósito: cada arquivo de teste tem seu próprio registro de
// módulos no Vitest, então dá para substituir o service no container global sem
// vazar a troca para as outras suítes.
describe('error handler', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    const failing: IProductService = {
      listProducts: async () => {
        throw new Error('falha inesperada no banco')
      },
      getProduct: async () => {
        throw new ValidationError('id inválido')
      },
    }
    container.register(PRODUCT_SERVICE_TOKEN, { useValue: failing })

    // import dinâmico: buildServer resolve o controller ao registrar as rotas,
    // então o override precisa acontecer antes.
    const { buildServer } = await import('./server.js')
    app = await buildServer({ logger: false })
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('converte erro inesperado em 500 sem vazar a mensagem interna', async () => {
    const res = await app.inject({ method: 'GET', url: '/products' })

    expect(res.statusCode).toBe(500)
    expect(res.json()).toEqual({
      error: { statusCode: 500, message: 'Internal Server Error' },
    })
    expect(res.body).not.toContain('falha inesperada no banco')
  })

  it('usa o statusCode e a mensagem de qualquer AppError', async () => {
    const res = await app.inject({ method: 'GET', url: '/products/abc' })

    expect(res.statusCode).toBe(400)
    expect(res.json()).toEqual({
      error: { statusCode: 400, message: 'id inválido' },
    })
  })
})
