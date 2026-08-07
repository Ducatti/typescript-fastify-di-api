import js from '@eslint/js'
import tseslint from 'typescript-eslint'

/**
 * A regra de dependência da arquitetura é verificada aqui, não só documentada.
 * Direção permitida:
 *   presentation ─┐
 *                 ├─> application ──> domain
 *   infrastructure┘
 * Só `main/` (composition root) pode importar de todas as camadas.
 */
const FRAMEWORKS = ['fastify', '@fastify/*', 'tsyringe', 'pino', '@sinclair/*']

function layerBoundary(files, forbidden, message) {
  return {
    files,
    // Testes podem atravessar camadas: é o papel deles montar o grafo.
    ignores: ['**/*.test.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        { patterns: forbidden.map(group => ({ group: [group], message })) },
      ],
    },
  }
}

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'coverage/**',
      // fora do tsconfig (rootDir: ./src), logo não é lintável com type-info
      'vitest.config.ts',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: { project: './tsconfig.json' },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-console': 'off',
    },
  },

  layerBoundary(
    ['src/domain/**/*.ts'],
    [
      '**/application/**',
      '**/infrastructure/**',
      '**/presentation/**',
      '**/main/**',
      ...FRAMEWORKS,
    ],
    'domain é a camada mais interna: não pode importar outras camadas nem frameworks.'
  ),

  layerBoundary(
    ['src/application/**/*.ts'],
    [
      '**/infrastructure/**',
      '**/presentation/**',
      '**/main/**',
      ...FRAMEWORKS,
    ],
    'application só pode depender de domain e dos próprios ports — nunca de adaptadores ou frameworks.'
  ),

  layerBoundary(
    ['src/infrastructure/**/*.ts'],
    ['**/presentation/**', '**/main/**'],
    'infrastructure implementa ports; não conhece adaptadores de entrada nem o composition root.'
  ),

  layerBoundary(
    ['src/presentation/**/*.ts'],
    ['**/infrastructure/**', '**/main/**'],
    'presentation fala com use cases e ports; a escolha da implementação é do composition root.'
  )
)
