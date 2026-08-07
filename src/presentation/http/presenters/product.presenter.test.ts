import { describe, it, expect } from 'vitest'
import { createProduct } from '../../../domain/entities/product.js'
import {
  toProductDto,
  toProductListResponse,
  toProductResponse,
} from './product.presenter.js'

const product = createProduct({ id: '1', name: 'Teclado', price: 450 })

describe('product presenter', () => {
  it('toProductDto expõe exatamente os campos do contrato', () => {
    expect(Object.keys(toProductDto(product)).sort()).toEqual([
      'id',
      'name',
      'price',
    ])
  })

  it('toProductResponse envolve em { data }', () => {
    expect(toProductResponse(product)).toEqual({
      data: { id: '1', name: 'Teclado', price: 450 },
    })
  })

  it('toProductListResponse calcula total a partir da lista', () => {
    expect(toProductListResponse([product, product])).toEqual({
      data: [
        { id: '1', name: 'Teclado', price: 450 },
        { id: '1', name: 'Teclado', price: 450 },
      ],
      total: 2,
    })
  })

  it('toProductListResponse devolve total 0 para lista vazia', () => {
    expect(toProductListResponse([])).toEqual({ data: [], total: 0 })
  })
})
