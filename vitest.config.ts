import { defineConfig } from 'vitest/config'
import swc from 'unplugin-swc'

export default defineConfig({
  plugins: [
    // O esbuild (transformador padrão do Vite) não implementa `emitDecoratorMetadata`,
    // que o tsyringe usa para descobrir os tipos do construtor. O swc implementa,
    // então o container resolve as dependências nos testes igual em produção.
    swc.vite({
      module: { type: 'es6' },
      jsc: {
        target: 'es2022',
        parser: { syntax: 'typescript', decorators: true },
        transform: { legacyDecorator: true, decoratorMetadata: true },
      },
    }),
  ],
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    setupFiles: ['src/test/setup.ts'],
    env: { LOG_LEVEL: 'silent' },   // cala o PinoLogger resolvido pelo container
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      exclude: ['src/**/I*.ts', 'src/test/**', 'src/main.ts', 'src/types/tokens.ts'],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
    },
  },
})
