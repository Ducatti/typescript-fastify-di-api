import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // vitest.config.ts fica fora do tsconfig (rootDir: ./src), então não é lintável com type-info
  { ignores: ['dist/**', 'node_modules/**', 'coverage/**', 'vitest.config.ts'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
        },
      ],

      '@typescript-eslint/no-explicit-any': 'warn',

      'no-console': 'off',
    },
  },
)