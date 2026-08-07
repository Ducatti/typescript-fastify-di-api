import pino from 'pino'
import type { Logger } from '../../application/ports/logger.js'

export class PinoLogger implements Logger {
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
