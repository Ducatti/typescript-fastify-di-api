import { describe, it, expect, beforeEach } from 'vitest'
import { ProductService } from './product.service.js'
import { NotFoundError } from '../types/errors.js'
import type { ILogger } from '../logger/ILogger.js'
import type { IProductRepository } from '../repositories/IProductRepository.js'
import {
  createLoggerSpy,
  createProductRepositoryStub,
  PRODUCT_FIXTURES,
} from '../test/fakes.js'

describe('ProductService', () => {
  let repo: IProductRepository
  let logger: ILogger
  let service: ProductService

  beforeEach(() => {
    repo = createProductRepositoryStub(PRODUCT_FIXTURES)
    logger = createLoggerSpy()
    // Injeção manual: o teste unitário não depende do container.
    service = new ProductService(repo, logger)
  })

  describe('listProducts', () => {
    it('devolve tudo que o repositório retorna', async () => {
      await expect(service.listProducts()).resolves.toEqual(PRODUCT_FIXTURES)
      expect(repo.findAll).toHaveBeenCalledOnce()
    })

    it('devolve lista vazia quando não há produtos', async () => {
      service = new ProductService(createProductRepositoryStub([]), logger)
      await expect(service.listProducts()).resolves.toEqual([])
    })

    it('propaga a falha do repositório sem mascarar', async () => {
      const boom = new Error('conexão perdida')
      repo.findAll = async () => {
        throw boom
      }
      await expect(service.listProducts()).rejects.toBe(boom)
    })
  })

  describe('getProduct', () => {
    it('devolve o produto quando o id existe', async () => {
      await expect(service.getProduct('2')).resolves.toEqual(PRODUCT_FIXTURES[1])
      expect(repo.findById).toHaveBeenCalledWith('2')
    })

    it('lança NotFoundError com status 404 quando o id não existe', async () => {
      const error = await service.getProduct('999').catch((e: unknown) => e)

      expect(error).toBeInstanceOf(NotFoundError)
      expect(error).toMatchObject({ statusCode: 404, name: 'NotFoundError' })
    })

    it('loga um warn com o id ausente', async () => {
      await service.getProduct('999').catch(() => undefined)

      expect(logger.warn).toHaveBeenCalledWith('Product does not exist', {
        id: '999',
      })
    })
  })
})
