import { describe, it, expect, vi, beforeEach } from 'vitest'
import pino from 'pino'

const pinoInstance = {
  info: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
  debug: vi.fn(),
}

vi.mock('pino', () => ({ default: vi.fn(() => pinoInstance) }))

// Import depois do mock para o construtor pegar o dublê.
const { PinoLogger } = await import('./pino.logger.js')

describe('PinoLogger', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it.each(['info', 'warn', 'error', 'debug'] as const)(
    '%s repassa (data, msg) na ordem que o pino espera',
    method => {
      new PinoLogger()[method]('mensagem', { id: '1' })

      expect(pinoInstance[method]).toHaveBeenCalledWith({ id: '1' }, 'mensagem')
    }
  )

  it.each(['info', 'warn', 'error', 'debug'] as const)(
    '%s usa objeto vazio quando não recebe data',
    method => {
      new PinoLogger()[method]('sem contexto')

      expect(pinoInstance[method]).toHaveBeenCalledWith({}, 'sem contexto')
    }
  )

  it('usa LOG_LEVEL do ambiente quando definido', () => {
    vi.stubEnv('LOG_LEVEL', 'trace')
    new PinoLogger()
    expect(pino).toHaveBeenLastCalledWith({ level: 'trace' })
    vi.unstubAllEnvs()
  })

  it('cai para "info" quando LOG_LEVEL não está definido', () => {
    vi.stubEnv('LOG_LEVEL', undefined)
    new PinoLogger()
    expect(pino).toHaveBeenLastCalledWith({ level: 'info' })
    vi.unstubAllEnvs()
  })
})
