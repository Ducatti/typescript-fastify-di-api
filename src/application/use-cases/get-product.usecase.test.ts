import { describe, it, expect } from 'vitest'
import { ProductNotFoundError } from '../../domain/errors/domain.errors.js'
import {
  PRODUCT_FIXTURES,
  createLoggerSpy,
  createProductRepositoryStub,
} from '../../test/fakes.js'
import { GetProductUseCase } from './get-product.usecase.js'

describe('GetProductUseCase', () => {
  function build() {
    const repo = createProductRepositoryStub(PRODUCT_FIXTURES)
    const logger = createLoggerSpy()
    return { repo, logger, useCase: new GetProductUseCase(repo, logger) }
  }

  it('devolve o produto quando o id existe', async () => {
    const { useCase, repo } = build()

    await expect(useCase.execute({ id: '2' })).resolves.toEqual(
      PRODUCT_FIXTURES[1]
    )
    expect(repo.findById).toHaveBeenCalledWith('2')
  })

  it('lança ProductNotFoundError com o id, sem statusCode', async () => {
    const { useCase } = build()

    const error = await useCase.execute({ id: '999' }).catch((e: unknown) => e)

    expect(error).toBeInstanceOf(ProductNotFoundError)
    expect(error).toMatchObject({ code: 'PRODUCT_NOT_FOUND', productId: '999' })
    expect(error).not.toHaveProperty('statusCode')
  })

  it('loga um warn com o id ausente', async () => {
    const { useCase, logger } = build()

    await useCase.execute({ id: '999' }).catch(() => undefined)

    expect(logger.warn).toHaveBeenCalledWith('Product does not exist', {
      id: '999',
    })
  })
})
