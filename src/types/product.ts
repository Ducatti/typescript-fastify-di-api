export interface Product {
  id: string
  name: string
  price: number
}

export interface ProductListResponse {
  data: Product[]
  total: number
}