import { describe, it, expect } from 'vitest'
import { GetProductUseCase } from '../../../application/use-cases/get-product.usecase.js'
import { ListProductsUseCase } from '../../../application/use-cases/list-products.usecase.js'
import { ProductNotFoundError } from '../../../domain/errors/domain.errors.js'
import {
  PRODUCT_FIXTURES,
  createLoggerSpy,
  createProductRepositoryStub,
} from '../../../test/fakes.js'
import { ProductController } from './product.controller.js'

function build(products = PRODUCT_FIXTURES) {
  const repo = createProductRepositoryStub(products)
  const logger = createLoggerSpy()
  return new ProductController(
    new ListProductsUseCase(repo, logger),
    new GetProductUseCase(repo, logger)
  )
}

describe('ProductController', () => {
  it('list devolve o contrato { data, total }', async () => {
    await expect(build().list()).resolves.toEqual({
      data: [
        { id: '1', name: 'Teclado mecânico', price: 450 },
        { id: '2', name: 'Monitor 27"', price: 1800 },
      ],
      total: 2,
    })
  })

  it('list devolve total 0 quando não há produtos', async () => {
    await expect(build([]).list()).resolves.toEqual({ data: [], total: 0 })
  })

  it('getById devolve o contrato { data }', async () => {
    await expect(build().getById('2')).resolves.toEqual({
      data: { id: '2', name: 'Monitor 27"', price: 1800 },
    })
  })

  it('getById deixa o erro de domínio subir para o error handler', async () => {
    await expect(build().getById('999')).rejects.toBeInstanceOf(
      ProductNotFoundError
    )
  })
})
