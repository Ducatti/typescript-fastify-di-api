import type { InjectionToken } from 'tsyringe'
import type { ILogger } from '../logger/ILogger.js'
import type { IProductRepository } from '../repositories/IProductRepository.js'
import type { IProductService } from '../services/IProductService.js'
import type { IProductController } from '../controllers/IProductController.js'

export const LOGGER_TOKEN: InjectionToken<ILogger> = Symbol('ILogger')

export const PRODUCT_REPOSITORY_TOKEN: InjectionToken<IProductRepository> =
  Symbol('IProductRepository')

export const PRODUCT_SERVICE_TOKEN: InjectionToken<IProductService> =
  Symbol('IProductService')

export const PRODUCT_CONTROLLER_TOKEN: InjectionToken<IProductController> =
  Symbol('IProductController')