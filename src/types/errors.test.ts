import { describe, it, expect } from 'vitest'
import { AppError, NotFoundError, ValidationError } from './errors.js'

describe('AppError', () => {
  it('guarda mensagem e statusCode e continua sendo um Error', () => {
    const error = new AppError('algo quebrou', 503)

    expect(error).toBeInstanceOf(Error)
    expect(error.message).toBe('algo quebrou')
    expect(error.statusCode).toBe(503)
    expect(error.name).toBe('AppError')
    expect(error.stack).toBeDefined()
  })
})

describe('NotFoundError', () => {
  it('monta a mensagem a partir do recurso e usa 404', () => {
    const error = new NotFoundError('Produto')

    expect(error).toBeInstanceOf(AppError)
    expect(error.message).toBe('Produto não encontrado')
    expect(error.statusCode).toBe(404)
    expect(error.name).toBe('NotFoundError')
  })
})

describe('ValidationError', () => {
  it('preserva a mensagem recebida e usa 400', () => {
    const error = new ValidationError('price deve ser positivo')

    expect(error).toBeInstanceOf(AppError)
    expect(error.message).toBe('price deve ser positivo')
    expect(error.statusCode).toBe(400)
    expect(error.name).toBe('ValidationError')
  })
})
