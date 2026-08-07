import type { InjectionToken } from 'tsyringe'
import type { Logger } from '../application/ports/logger.js'
import type { ProductRepository } from '../application/ports/product.repository.js'
import type { GetProductUseCase } from '../application/use-cases/get-product.usecase.js'
import type { ListProductsUseCase } from '../application/use-cases/list-products.usecase.js'

/**
 * Tokens moram no composition root, não em `types/`: são um detalhe de
 * montagem. É a única camada com permissão para importar de todas as outras.
 */
export const LOGGER: InjectionToken<Logger> = Symbol('Logger')

export const PRODUCT_REPOSITORY: InjectionToken<ProductRepository> =
  Symbol('ProductRepository')

export const LIST_PRODUCTS: InjectionToken<ListProductsUseCase> =
  Symbol('ListProductsUseCase')

export const GET_PRODUCT: InjectionToken<GetProductUseCase> =
  Symbol('GetProductUseCase')
