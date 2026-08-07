import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import type { FastifyInstance } from 'fastify'
import { buildServer } from './server.js'

// Testes de integração: exercitam rotas + schemas + error handler reais,
// via `app.inject()` (injeção HTTP em memória — nenhuma porta é aberta).
describe('HTTP', () => {
  let app: FastifyInstance

  beforeAll(async () => {
    app = await buildServer({ logger: false })
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('GET /health', () => {
    it('responde 200 com o payload de saúde', async () => {
      const res = await app.inject({ method: 'GET', url: '/health' })

      expect(res.statusCode).toBe(200)
      expect(res.json()).toMatchObject({ status: 'ok' })
      expect(res.json().uptime).toBeGreaterThan(0)
      expect(Date.parse(res.json().timestamp)).not.toBeNaN()
    })
  })

  describe('GET /products', () => {
    it('responde 200 com { data, total } coerentes', async () => {
      const res = await app.inject({ method: 'GET', url: '/products' })
      const body = res.json()

      expect(res.statusCode).toBe(200)
      expect(body.total).toBe(body.data.length)
      expect(body.data.length).toBeGreaterThan(0)
    })

    it('serializa cada produto com id, name e price', async () => {
      const res = await app.inject({ method: 'GET', url: '/products' })

      for (const product of res.json().data) {
        expect(Object.keys(product).sort()).toEqual(['id', 'name', 'price'])
        expect(typeof product.price).toBe('number')
      }
    })
  })

  describe('GET /products/:id', () => {
    it('responde 200 com o produto pedido', async () => {
      const res = await app.inject({ method: 'GET', url: '/products/1' })

      expect(res.statusCode).toBe(200)
      expect(res.json()).toEqual({
        data: { id: '1', name: 'Teclado mecânico', price: 450 },
      })
    })

    it('responde 404 no formato de erro padrão quando o id não existe', async () => {
      const res = await app.inject({ method: 'GET', url: '/products/999' })

      expect(res.statusCode).toBe(404)
      expect(res.json()).toEqual({
        error: { statusCode: 404, message: 'Produto não encontrado' },
      })
    })
  })

  describe('rotas desconhecidas', () => {
    it('responde 404 para caminho inexistente', async () => {
      const res = await app.inject({ method: 'GET', url: '/nao-existe' })
      expect(res.statusCode).toBe(404)
    })
  })

  describe('documentação', () => {
    it('expõe o OpenAPI em /docs/json com as rotas registradas', async () => {
      const res = await app.inject({ method: 'GET', url: '/docs/json' })
      const spec = res.json()

      expect(res.statusCode).toBe(200)
      expect(spec.info.title).toBe('Fastify DI API')
      expect(Object.keys(spec.paths)).toEqual(
        expect.arrayContaining(['/health', '/products', '/products/{id}'])
      )
    })
  })
})
