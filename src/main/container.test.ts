import { describe, it, expect } from 'vitest'
import { GetProductUseCase } from '../application/use-cases/get-product.usecase.js'
import { ListProductsUseCase } from '../application/use-cases/list-products.usecase.js'
import { ProductNotFoundError } from '../domain/errors/domain.errors.js'
import { PinoLogger } from '../infrastructure/logging/pino.logger.js'
import { ProductMemoryRepository } from '../infrastructure/persistence/product.memory.repository.js'
import { buildContainer, buildDependencies } from './container.js'
import { GET_PRODUCT, LIST_PRODUCTS, LOGGER, PRODUCT_REPOSITORY } from './tokens.js'

describe('composition root', () => {
  it('resolve cada token para a implementação registrada', () => {
    const c = buildContainer()

    expect(c.resolve(LOGGER)).toBeInstanceOf(PinoLogger)
    expect(c.resolve(PRODUCT_REPOSITORY)).toBeInstanceOf(ProductMemoryRepository)
    expect(c.resolve(LIST_PRODUCTS)).toBeInstanceOf(ListProductsUseCase)
    expect(c.resolve(GET_PRODUCT)).toBeInstanceOf(GetProductUseCase)
  })

  it('logger e repositório são singletons dentro do mesmo container', () => {
    const c = buildContainer()

    expect(c.resolve(LOGGER)).toBe(c.resolve(LOGGER))
    expect(c.resolve(PRODUCT_REPOSITORY)).toBe(c.resolve(PRODUCT_REPOSITORY))
  })

  it('cada buildContainer devolve um grafo isolado', () => {
    // É isto que permite um teste montar seu próprio grafo sem vazar registros.
    expect(buildContainer().resolve(LOGGER)).not.toBe(
      buildContainer().resolve(LOGGER)
    )
  })

  it('buildDependencies entrega o grafo pronto para o adaptador HTTP', async () => {
    const deps = buildDependencies()

    expect(Object.keys(deps).sort()).toEqual([
      'getProduct',
      'listProducts',
      'logger',
    ])
    await expect(deps.listProducts.execute()).resolves.toHaveLength(3)
    await expect(deps.getProduct.execute({ id: '2' })).resolves.toMatchObject({
      name: 'Monitor 27"',
    })
  })

  it('a cadeia use case -> repositório está de fato ligada', async () => {
    const deps = buildDependencies()

    await expect(deps.getProduct.execute({ id: '999' })).rejects.toBeInstanceOf(
      ProductNotFoundError
    )
  })
})
