import { describe, it, expect, beforeEach } from 'vitest'
import { ProductMemoryRepository } from './product.memory.repository.js'

describe('ProductMemoryRepository', () => {
  let repo: ProductMemoryRepository

  beforeEach(() => {
    repo = new ProductMemoryRepository()
  })

  it('findAll devolve o seed completo', async () => {
    const products = await repo.findAll()

    expect(products).toHaveLength(3)
    expect(products.map(p => p.id)).toEqual(['1', '2', '3'])
    expect(products[0]).toEqual({
      id: '1',
      name: 'Teclado mecânico',
      price: 450,
    })
  })

  it('findById devolve o produto quando existe', async () => {
    await expect(repo.findById('3')).resolves.toMatchObject({
      id: '3',
      name: 'Webcam HD',
    })
  })

  it.each(['999', '', ' 1'])('findById devolve null para o id %j', async id => {
    await expect(repo.findById(id)).resolves.toBeNull()
  })

  it('instâncias distintas não compartilham estado', async () => {
    const other = new ProductMemoryRepository()
    expect(await other.findAll()).not.toBe(await repo.findAll())
  })
})
