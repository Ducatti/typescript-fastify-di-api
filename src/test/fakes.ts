import { vi } from 'vitest'
import type { Logger } from '../application/ports/logger.js'
import type { ProductRepository } from '../application/ports/product.repository.js'
import { GetProductUseCase } from '../application/use-cases/get-product.usecase.js'
import { ListProductsUseCase } from '../application/use-cases/list-products.usecase.js'
import { createProduct, type Product } from '../domain/entities/product.js'
import type { AppDependencies } from '../presentation/http/server.js'

/** Logger espionável — nenhuma saída, mas dá para assertar as chamadas. */
export function createLoggerSpy(): Logger {
  return { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() }
}

/** Adaptador de persistência controlável pelo teste. */
export function createProductRepositoryStub(
  products: Product[] = []
): ProductRepository {
  return {
    findAll: vi.fn(async () => products),
    findById: vi.fn(async (id: string) => products.find(p => p.id === id) ?? null),
  }
}

export const PRODUCT_FIXTURES: Product[] = [
  createProduct({ id: '1', name: 'Teclado mecânico', price: 450 }),
  createProduct({ id: '2', name: 'Monitor 27"', price: 1800 }),
]

/**
 * Grafo completo com dublês, pronto para `buildServer(deps)`.
 * Note que trocar uma dependência é passar outro objeto — não existe mais
 * container global para mutar.
 */
export function createAppDependencies(
  repository: ProductRepository = createProductRepositoryStub(PRODUCT_FIXTURES),
  logger: Logger = createLoggerSpy()
): AppDependencies {
  return {
    logger,
    listProducts: new ListProductsUseCase(repository, logger),
    getProduct: new GetProductUseCase(repository, logger),
  }
}
