import 'reflect-metadata' // exigido pelo tsyringe mesmo sem decorators; só aqui
import {
  container,
  instanceCachingFactory,
  type DependencyContainer,
} from 'tsyringe'
import { GetProductUseCase } from '../application/use-cases/get-product.usecase.js'
import { ListProductsUseCase } from '../application/use-cases/list-products.usecase.js'
import { PinoLogger } from '../infrastructure/logging/pino.logger.js'
import { ProductMemoryRepository } from '../infrastructure/persistence/product.memory.repository.js'
import type { AppDependencies } from '../presentation/http/server.js'
import {
  GET_PRODUCT,
  LIST_PRODUCTS,
  LOGGER,
  PRODUCT_REPOSITORY,
} from './tokens.js'

/**
 * Composition root: o único lugar que conhece implementações concretas.
 *
 * O wiring é explícito (useFactory) em vez de decorators, para que domínio e
 * aplicação não importem tsyringe. O efeito colateral é bem-vindo: sem
 * decorators, o projeto dispensa `emitDecoratorMetadata` e o transformador
 * extra nos testes.
 *
 * Cada chamada devolve um container filho novo, então um teste pode montar um
 * grafo isolado sem vazar registros para os outros.
 */
export function buildContainer(): DependencyContainer {
  const c = container.createChildContainer()

  c.register(LOGGER, {
    useFactory: instanceCachingFactory(() => new PinoLogger()),
  })

  c.register(PRODUCT_REPOSITORY, {
    useFactory: instanceCachingFactory(() => new ProductMemoryRepository()),
  })

  c.register(LIST_PRODUCTS, {
    useFactory: dc =>
      new ListProductsUseCase(dc.resolve(PRODUCT_REPOSITORY), dc.resolve(LOGGER)),
  })

  c.register(GET_PRODUCT, {
    useFactory: dc =>
      new GetProductUseCase(dc.resolve(PRODUCT_REPOSITORY), dc.resolve(LOGGER)),
  })

  return c
}

/** Resolve o grafo uma vez; daqui pra frente tudo é passado por parâmetro. */
export function buildDependencies(
  c: DependencyContainer = buildContainer()
): AppDependencies {
  return {
    logger: c.resolve(LOGGER),
    listProducts: c.resolve(LIST_PRODUCTS),
    getProduct: c.resolve(GET_PRODUCT),
  }
}
