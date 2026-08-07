import { DomainError } from '../../domain/errors/domain.errors.js'
import type { ErrorResponse } from './schemas/product.schemas.js'

/**
 * Único lugar que sabe traduzir domínio -> HTTP.
 * Código de domínio ausente aqui cai em 500 de propósito: é melhor um erro
 * ruidoso do que um status inventado silenciosamente.
 */
const STATUS_BY_DOMAIN_CODE: Readonly<Record<string, number>> = {
  PRODUCT_NOT_FOUND: 404,
  INVALID_PRODUCT: 400,
}

export interface MappedError {
  statusCode: number
  body: ErrorResponse
}

export function mapDomainError(error: unknown): MappedError | null {
  if (!(error instanceof DomainError)) return null

  const statusCode = STATUS_BY_DOMAIN_CODE[error.code]
  if (statusCode === undefined) return null

  return {
    statusCode,
    body: { error: { statusCode, message: error.message } },
  }
}

/**
 * Erros que o próprio Fastify levanta antes do handler (params fora do
 * schema, body inválido) já vêm com statusCode < 500 e mensagem segura.
 */
export function mapClientError(error: unknown): MappedError | null {
  if (typeof error !== 'object' || error === null) return null

  const { statusCode, message } = error as {
    statusCode?: unknown
    message?: unknown
  }
  if (typeof statusCode !== 'number' || statusCode >= 500) return null
  if (typeof message !== 'string') return null

  return { statusCode, body: { error: { statusCode, message } } }
}

export function internalError(): MappedError {
  return {
    statusCode: 500,
    body: { error: { statusCode: 500, message: 'Internal Server Error' } },
  }
}
