import type { Product } from '../../../domain/entities/product.js'
import type {
  ProductDto,
  ProductListResponse,
  ProductResponse,
} from '../schemas/product.schemas.js'

/**
 * Traduz entidade -> contrato HTTP. É aqui que o formato de resposta
 * (`{ data }`) é decidido — o domínio não sabe que ele existe.
 */
export function toProductDto(product: Product): ProductDto {
  return { id: product.id, name: product.name, price: product.price }
}

export function toProductResponse(product: Product): ProductResponse {
  return { data: toProductDto(product) }
}

export function toProductListResponse(products: Product[]): ProductListResponse {
  return { data: products.map(toProductDto), total: products.length }
}
