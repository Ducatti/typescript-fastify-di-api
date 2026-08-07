import { describe, it, expect, vi } from 'vitest'
import { ProductController } from './product.controller.js'
import { NotFoundError } from '../types/errors.js'
import type { IProductService } from '../services/IProductService.js'
import {
  createReplyStub,
  createRequestStub,
  PRODUCT_FIXTURES,
} from '../test/fakes.js'

function createServiceStub(
  overrides: Partial<IProductService> = {}
): IProductService {
  return {
    listProducts: vi.fn(async () => PRODUCT_FIXTURES),
    getProduct: vi.fn(async () => PRODUCT_FIXTURES[0]!),
    ...overrides,
  }
}

describe('ProductController', () => {
  describe('list', () => {
    it('envolve a lista em { data, total }', async () => {
      const controller = new ProductController(createServiceStub())
      const reply = createReplyStub()

      await controller.list(createRequestStub({}), reply)

      expect(reply.sent).toEqual({
        data: PRODUCT_FIXTURES,
        total: PRODUCT_FIXTURES.length,
      })
    })

    it('total é 0 quando não há produtos', async () => {
      const controller = new ProductController(
        createServiceStub({ listProducts: vi.fn(async () => []) })
      )
      const reply = createReplyStub()

      await controller.list(createRequestStub({}), reply)

      expect(reply.sent).toEqual({ data: [], total: 0 })
    })
  })

  describe('getById', () => {
    it('repassa o id da rota para o service', async () => {
      const service = createServiceStub()
      const controller = new ProductController(service)
      const reply = createReplyStub()

      await controller.getById(createRequestStub({ params: { id: '42' } }), reply)

      expect(service.getProduct).toHaveBeenCalledWith('42')
      expect(reply.sent).toEqual({ data: PRODUCT_FIXTURES[0] })
    })

    it('deixa o erro do service subir para o error handler do Fastify', async () => {
      const controller = new ProductController(
        createServiceStub({
          getProduct: vi.fn(async () => {
            throw new NotFoundError('Produto')
          }),
        })
      )
      const reply = createReplyStub()

      await expect(
        controller.getById(createRequestStub({ params: { id: '999' } }), reply)
      ).rejects.toBeInstanceOf(NotFoundError)

      expect(reply.send).not.toHaveBeenCalled()
    })
  })
})
