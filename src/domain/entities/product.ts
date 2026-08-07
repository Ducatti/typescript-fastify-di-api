import { InvalidProductError } from '../errors/domain.errors.js'

/**
 * Dado plano e imutável, não uma classe com métodos.
 *
 * A escolha é deliberada: entidades que atravessam fronteiras de serialização
 * (fila, step de workflow durável, cache) voltam como objeto pelado e perdem
 * os métodos silenciosamente. Invariante mora na factory abaixo, não em
 * instância — o que dá a mesma garantia sem apostar contra o serializador.
 */
export interface Product {
  readonly id: string
  readonly name: string
  readonly price: number
}

export const PRODUCT_NAME_MAX_LENGTH = 120

export interface CreateProductInput {
  id: string
  name: string
  price: number
}

/** Único caminho válido para produzir um Product. Lança InvalidProductError. */
export function createProduct({ id, name, price }: CreateProductInput): Product {
  const trimmedId = id.trim()
  if (trimmedId === '') {
    throw new InvalidProductError('id é obrigatório')
  }

  const trimmedName = name.trim()
  if (trimmedName === '') {
    throw new InvalidProductError('name é obrigatório')
  }
  if (trimmedName.length > PRODUCT_NAME_MAX_LENGTH) {
    throw new InvalidProductError(
      `name deve ter no máximo ${PRODUCT_NAME_MAX_LENGTH} caracteres`
    )
  }

  if (!Number.isFinite(price)) {
    throw new InvalidProductError('price deve ser um número finito')
  }
  if (price <= 0) {
    throw new InvalidProductError('price deve ser maior que zero')
  }

  return Object.freeze({ id: trimmedId, name: trimmedName, price })
}
