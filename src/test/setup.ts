// Carregado antes de qualquer suíte (vitest.config.ts -> test.setupFiles).
// Os decorators do tsyringe leem/escrevem metadata na importação do módulo,
// então o polyfill precisa existir antes de qualquer import de código da app.
import 'reflect-metadata'
