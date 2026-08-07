import { describe, it, expect } from 'vitest'
import {
  DomainError,
  InvalidProductError,
  ProductNotFoundError,
} from './domain.errors.js'

describe('erros de domínio', () => {
  it('ProductNotFoundError carrega o id e um code estável', () => {
    const error = new ProductNotFoundError('42')

    expect(error).toBeInstanceOf(DomainError)
    expect(error).toBeInstanceOf(Error)
    expect(error.code).toBe('PRODUCT_NOT_FOUND')
    expect(error.productId).toBe('42')
    expect(error.message).toBe('Produto 42 não encontrado')
    expect(error.name).toBe('ProductNotFoundError')
  })

  it('InvalidProductError preserva a mensagem recebida', () => {
    const error = new InvalidProductError('price deve ser maior que zero')

    expect(error.code).toBe('INVALID_PRODUCT')
    expect(error.message).toBe('price deve ser maior que zero')
    expect(error.name).toBe('InvalidProductError')
  })

  it('nenhum erro de domínio expõe statusCode — HTTP é decidido na borda', () => {
    for (const error of [
      new ProductNotFoundError('1'),
      new InvalidProductError('x'),
    ]) {
      expect(error).not.toHaveProperty('statusCode')
    }
  })
})
