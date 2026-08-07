import { describe, it, expect } from 'vitest'
import {
  PRODUCT_FIXTURES,
  createLoggerSpy,
  createProductRepositoryStub,
} from '../../test/fakes.js'
import { ListProductsUseCase } from './list-products.usecase.js'

describe('ListProductsUseCase', () => {
  it('devolve o que o repositório retorna', async () => {
    const repo = createProductRepositoryStub(PRODUCT_FIXTURES)

    // Injeção manual: nenhum container envolvido, nenhum decorator.
    const useCase = new ListProductsUseCase(repo, createLoggerSpy())

    await expect(useCase.execute()).resolves.toEqual(PRODUCT_FIXTURES)
    expect(repo.findAll).toHaveBeenCalledOnce()
  })

  it('devolve lista vazia quando não há produtos', async () => {
    const useCase = new ListProductsUseCase(
      createProductRepositoryStub([]),
      createLoggerSpy()
    )

    await expect(useCase.execute()).resolves.toEqual([])
  })

  it('propaga a falha do repositório sem mascarar', async () => {
    const repo = createProductRepositoryStub([])
    const boom = new Error('conexão perdida')
    repo.findAll = async () => {
      throw boom
    }

    const useCase = new ListProductsUseCase(repo, createLoggerSpy())

    await expect(useCase.execute()).rejects.toBe(boom)
  })
})
