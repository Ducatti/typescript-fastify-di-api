/**
 * Erros de domínio não conhecem HTTP. Quem traduz `code` em status é o
 * adaptador de entrada — ver presentation/http/error-mapper.ts.
 * Assim a mesma regra de negócio serve HTTP, worker, CLI ou fila.
 */
export abstract class DomainError extends Error {
  abstract readonly code: string

  constructor(message: string) {
    super(message)
    this.name = new.target.name
  }
}

export class ProductNotFoundError extends DomainError {
  readonly code = 'PRODUCT_NOT_FOUND'

  constructor(readonly productId: string) {
    super(`Produto ${productId} não encontrado`)
  }
}

export class InvalidProductError extends DomainError {
  readonly code = 'INVALID_PRODUCT'

  constructor(message: string) {
    super(message)
  }
}
