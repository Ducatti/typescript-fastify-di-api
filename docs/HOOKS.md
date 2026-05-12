# Pre-commit Hooks Setup

Este projeto usa **Husky** para configurar git hooks automáticos.

## Instalação

### 1. Instalar Husky
```bash
npm install husky --save-dev
```

### 2. Inicializar Husky (automático)
Ao rodar `npm install`, o script `prepare` será executado automaticamente:
```bash
npm install
```

Isso vai:
- Instalar husky
- Gerar a pasta `.husky/`
- Ativar os hooks

## Hooks Configurados

### `pre-commit`
Antes de fazer commit, roda:
```bash
npm run check
```
(Verifica tipos TypeScript com `tsc --noEmit`)

Se houver erros de tipo, o commit será bloqueado ❌

## Uso

### Fazer commit (com validação)
```bash
git add .
git commit -m "Sua mensagem"
```

Se passar no typecheck ✅, o commit é criado.

### Pular validação (emergência)
```bash
git commit --no-verify -m "Sua mensagem"
```

⚠️ Use apenas em casos de emergência!

## Adicionar Mais Hooks

Para adicionar novos hooks:
```bash
npx husky add .husky/hook-name "seu-comando"
```

Exemplos:
```bash
# Lint antes de commit
npx husky add .husky/pre-commit "npm run lint"

# Testes antes de push
npx husky add .husky/pre-push "npm test"
```
