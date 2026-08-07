import { describe, it, expect } from 'vitest'
import {
  DomainError,
  InvalidProductError,
  ProductNotFoundError,
} from '../../domain/errors/domain.errors.js'
import { internalError, mapClientError, mapDomainError } from './error-mapper.js'

class UnmappedDomainError extends DomainError {
  readonly code = 'SOMETHING_NEW'
}

describe('mapDomainError', () => {
  it('traduz ProductNotFoundError em 404', () => {
    expect(mapDomainError(new ProductNotFoundError('7'))).toEqual({
      statusCode: 404,
      body: { error: { statusCode: 404, message: 'Produto 7 não encontrado' } },
    })
  })

  it('traduz InvalidProductError em 400', () => {
    expect(mapDomainError(new InvalidProductError('price inválido'))).toEqual({
      statusCode: 400,
      body: { error: { statusCode: 400, message: 'price inválido' } },
    })
  })

  it('devolve null para erro de domínio ainda não mapeado', () => {
    // De propósito: um code novo cai em 500 ruidoso em vez de status inventado.
    expect(mapDomainError(new UnmappedDomainError('novo caso'))).toBeNull()
  })

  it.each([new Error('genérico'), 'string', null, undefined, { code: 'x' }])(
    'devolve null para não-DomainError (%j)',
    value => {
      expect(mapDomainError(value)).toBeNull()
    }
  )
})

describe('mapClientError', () => {
  it('aproveita statusCode < 500 vindo do Fastify', () => {
    expect(
      mapClientError({ statusCode: 400, message: "params/id must be string" })
    ).toEqual({
      statusCode: 400,
      body: {
        error: { statusCode: 400, message: "params/id must be string" },
      },
    })
  })

  it.each([
    ['statusCode 500', { statusCode: 500, message: 'x' }],
    ['statusCode ausente', { message: 'x' }],
    ['statusCode não numérico', { statusCode: '400', message: 'x' }],
    ['message ausente', { statusCode: 400 }],
    ['não-objeto', 'boom'],
    ['null', null],
  ])('devolve null para %s', (_label, value) => {
    expect(mapClientError(value)).toBeNull()
  })
})

describe('internalError', () => {
  it('não vaza detalhe interno', () => {
    expect(internalError()).toEqual({
      statusCode: 500,
      body: { error: { statusCode: 500, message: 'Internal Server Error' } },
    })
  })
})
