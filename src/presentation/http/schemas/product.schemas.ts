import { Type, type Static } from '@sinclair/typebox'

/**
 * Schema e tipo definidos uma vez só. O type provider do Fastify usa estes
 * mesmos schemas para tipar `reply.send()`, então um payload que não bata
 * com o contrato vira erro de compilação em vez de 500 em runtime.
 */
export const ProductSchema = Type.Object(
  {
    id: Type.String({ examples: ['123e4567-e89b-12d3-a456-426614174000'] }),
    name: Type.String({ examples: ['Notebook'] }),
    price: Type.Number({ examples: [2999.9] }),
  },
  { $id: 'Product' }
)

export const ProductResponseSchema = Type.Object(
  { data: Type.Ref(ProductSchema) },
  { $id: 'ProductResponse' }
)

export const ProductListResponseSchema = Type.Object(
  {
    data: Type.Array(Type.Ref(ProductSchema)),
    total: Type.Integer(),
  },
  { $id: 'ProductListResponse' }
)

export const ErrorResponseSchema = Type.Object(
  {
    error: Type.Object({
      statusCode: Type.Integer(),
      message: Type.String(),
    }),
  },
  { $id: 'ErrorResponse' }
)

export const HealthResponseSchema = Type.Object(
  {
    status: Type.Literal('ok'),
    uptime: Type.Number(),
    timestamp: Type.String({ format: 'date-time' }),
    version: Type.String(),
  },
  { $id: 'HealthResponse' }
)

export const ProductParamsSchema = Type.Object({
  id: Type.String({ description: 'ID do produto' }),
})

export type ProductDto = Static<typeof ProductSchema>
export type ProductResponse = Static<typeof ProductResponseSchema>
export type ProductListResponse = Static<typeof ProductListResponseSchema>
export type ErrorResponse = Static<typeof ErrorResponseSchema>
export type HealthResponse = Static<typeof HealthResponseSchema>

/** Registrados uma vez no server para virarem components/schemas no OpenAPI. */
export const sharedSchemas = [
  ProductSchema,
  ProductResponseSchema,
  ProductListResponseSchema,
  ErrorResponseSchema,
  HealthResponseSchema,
]
