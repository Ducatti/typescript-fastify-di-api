export const productSchema = {
  $id: 'Product',
  type: 'object',
  properties: {
    id: { type: 'string', examples: ['123e4567-e89b-12d3-a456-426614174000'] },
    name: { type: 'string', examples: ['Notebook'] },
    price: { type: 'number', examples: [2999.9] },
  },
  required: ['id', 'name', 'price'],
} as const

export const productListResponseSchema = {
  $id: 'ProductListResponse',
  type: 'object',
  properties: {
    data: { type: 'array', items: { $ref: 'Product#' } },
    total: { type: 'integer' },
  },
  required: ['data', 'total'],
} as const

export const errorResponseSchema = {
  $id: 'ErrorResponse',
  type: 'object',
  properties: {
    error: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer' },
        message: { type: 'string' },
      },
      required: ['statusCode', 'message'],
    },
  },
  required: ['error'],
} as const
