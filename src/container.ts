import 'reflect-metadata'              // deve ser o primeiro import
import { container } from 'tsyringe'
import { PinoLogger } from './logger/pino.logger.js'
import { ProductMemoryRepository } from './repositories/product.memory.repository.js'
import { ProductService } from './services/product.service.js'
import { ProductController } from './controllers/product.controller.js'
import {
  LOGGER_TOKEN,
  PRODUCT_REPOSITORY_TOKEN,
  PRODUCT_SERVICE_TOKEN,
  PRODUCT_CONTROLLER_TOKEN,
} from './types/tokens.js'

container.registerSingleton(LOGGER_TOKEN, PinoLogger)

container.register(PRODUCT_REPOSITORY_TOKEN, {
  useClass: ProductMemoryRepository,
})

container.register(PRODUCT_SERVICE_TOKEN, {
  useClass: ProductService,
})

container.register(PRODUCT_CONTROLLER_TOKEN, {
  useClass: ProductController,
})

export { container }