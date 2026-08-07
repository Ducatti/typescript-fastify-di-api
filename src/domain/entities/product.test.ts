import { describe, it, expect } from 'vitest'
import { InvalidProductError } from '../errors/domain.errors.js'
import { PRODUCT_NAME_MAX_LENGTH, createProduct } from './product.js'

describe('createProduct', () => {
  const valid = { id: '1', name: 'Teclado', price: 450 }

  it('devolve o produto quando tudo é válido', () => {
    expect(createProduct(valid)).toEqual(valid)
  })

  it('normaliza espaços em id e name', () => {
    expect(createProduct({ ...valid, id: ' 1 ', name: '  Teclado  ' })).toEqual({
      id: '1',
      name: 'Teclado',
      price: 450,
    })
  })

  it('congela o resultado — entidade não é mutável por acidente', () => {
    const product = createProduct(valid)
    expect(Object.isFrozen(product)).toBe(true)
  })

  it.each([
    ['id vazio', { ...valid, id: '   ' }, 'id é obrigatório'],
    ['name vazio', { ...valid, name: '  ' }, 'name é obrigatório'],
    ['price zero', { ...valid, price: 0 }, 'price deve ser maior que zero'],
    ['price negativo', { ...valid, price: -1 }, 'price deve ser maior que zero'],
    [
      'price NaN',
      { ...valid, price: Number.NaN },
      'price deve ser um número finito',
    ],
    [
      'price infinito',
      { ...valid, price: Number.POSITIVE_INFINITY },
      'price deve ser um número finito',
    ],
  ])('rejeita %s', (_label, input, message) => {
    expect(() => createProduct(input)).toThrowError(
      new InvalidProductError(message)
    )
  })

  it(`rejeita name acima de ${PRODUCT_NAME_MAX_LENGTH} caracteres`, () => {
    const name = 'a'.repeat(PRODUCT_NAME_MAX_LENGTH + 1)

    expect(() => createProduct({ ...valid, name })).toThrowError(
      InvalidProductError
    )
    expect(() =>
      createProduct({ ...valid, name: 'a'.repeat(PRODUCT_NAME_MAX_LENGTH) })
    ).not.toThrow()
  })
})
