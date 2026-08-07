import { describe, it, expect } from 'vitest'
import { container } from './container.js'
import { ProductController } from './controllers/product.controller.js'
import { ProductService } from './services/product.service.js'
import { ProductMemoryRepository } from './repositories/product.memory.repository.js'
import { PinoLogger } from './logger/pino.logger.js'
import {
  LOGGER_TOKEN,
  PRODUCT_CONTROLLER_TOKEN,
  PRODUCT_REPOSITORY_TOKEN,
  PRODUCT_SERVICE_TOKEN,
} from './types/tokens.js'
import type { IProductController } from './controllers/IProductController.js'
import type { IProductService } from './services/IProductService.js'
import { createReplyStub, createRequestStub } from './test/fakes.js'

// Este arquivo é o que garante que os decorators do tsyringe continuam
// funcionando no ambiente de teste (ver o plugin swc em vitest.config.ts).
describe('container', () => {
  it('resolve cada token para a implementação registrada', () => {
    expect(container.resolve(PRODUCT_CONTROLLER_TOKEN)).toBeInstanceOf(
      ProductController
    )
    expect(container.resolve(PRODUCT_SERVICE_TOKEN)).toBeInstanceOf(ProductService)
    expect(container.resolve(PRODUCT_REPOSITORY_TOKEN)).toBeInstanceOf(
      ProductMemoryRepository
    )
    expect(container.resolve(LOGGER_TOKEN)).toBeInstanceOf(PinoLogger)
  })

  it('registra o logger como singleton', () => {
    expect(container.resolve(LOGGER_TOKEN)).toBe(container.resolve(LOGGER_TOKEN))
  })

  it('registra service e controller como transientes', () => {
    expect(container.resolve(PRODUCT_SERVICE_TOKEN)).not.toBe(
      container.resolve(PRODUCT_SERVICE_TOKEN)
    )
  })

  it('monta a cadeia controller -> service -> repository de ponta a ponta', async () => {
    const controller = container.resolve<IProductController>(
      PRODUCT_CONTROLLER_TOKEN
    )
    const reply = createReplyStub()

    await controller.getById(createRequestStub({ params: { id: '2' } }), reply)

    expect(reply.sent).toEqual({
      data: { id: '2', name: 'Monitor 27"', price: 1800 },
    })
  })

  it('permite trocar uma dependência por um dublê sem tocar no resto da cadeia', async () => {
    const child = container.createChildContainer()
    const fake: IProductService = {
      listProducts: async () => [{ id: 'x', name: 'Fake', price: 1 }],
      getProduct: async () => ({ id: 'x', name: 'Fake', price: 1 }),
    }
    child.register(PRODUCT_SERVICE_TOKEN, { useValue: fake })

    const controller = child.resolve<IProductController>(
      PRODUCT_CONTROLLER_TOKEN
    )
    const reply = createReplyStub()
    await controller.list(createRequestStub({}), reply)

    expect(reply.sent).toEqual({
      data: [{ id: 'x', name: 'Fake', price: 1 }],
      total: 1,
    })
    // o container pai segue intacto
    expect(container.resolve(PRODUCT_SERVICE_TOKEN)).toBeInstanceOf(ProductService)
  })
})
