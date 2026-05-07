import { injectable } from 'tsyringe'
import pino from 'pino'
import type { ILogger } from './ILogger.js'

@injectable()
export class PinoLogger implements ILogger {
  readonly #logger = pino({ level: process.env.LOG_LEVEL ?? 'info' })

  info(msg: string, data?: Record<string, unknown>): void {
    this.#logger.info(data ?? {}, msg)
  }

  warn(msg: string, data?: Record<string, unknown>): void {
    this.#logger.warn(data ?? {}, msg)
  }

  error(msg: string, data?: Record<string, unknown>): void {
    this.#logger.error(data ?? {}, msg)
  }

  debug(msg: string, data?: Record<string, unknown>): void {
    this.#logger.debug(data ?? {}, msg)
  }
}
