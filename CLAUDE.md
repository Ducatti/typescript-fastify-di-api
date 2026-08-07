# Instruções para agentes

API Fastify em TypeScript, estruturada em Clean Architecture / ports & adapters.
DI com TSyringe, **sem decorators** — o wiring é explícito no composition root.

Este arquivo cobre o que não é óbvio ao olhar o código e o que costuma ser feito
errado aqui. Estrutura e visão geral estão no [README](README.md).

## Regra de dependência

```
presentation ─┐
              ├─> application ──> domain
infrastructure┘
```

- `domain/` — dado e regra pura. Zero import de outra camada ou de framework.
- `application/` — use cases + os `ports/` que eles exigem. Só depende de `domain`.
- `infrastructure/` — implementa ports (persistência, log). Adaptadores de saída.
- `presentation/http/` — controllers, rotas, schemas, presenters. Adaptador de entrada.
- `main/` — composition root. **Única camada que pode importar de todas.**

Verificado no lint (`no-restricted-imports` por camada em `eslint.config.mjs`).
Arquivos `*.test.ts` são isentos — é papel deles atravessar camadas.

## Receita: adicionar um endpoint

Nesta ordem. Pular etapa costuma gerar código na camada errada.

1. **Domínio** (se houver conceito novo): entidade em `domain/entities/` com as
   invariantes numa factory `createX()`; erro em `domain/errors/domain.errors.ts`
   estendendo `DomainError`, com um `code` — **sem `statusCode`**.
2. **Port** (se precisar de capacidade nova): interface em `application/ports/`.
3. **Use case**: `application/use-cases/<nome>.usecase.ts`, uma classe com um
   `execute()`. Dependências chegam pelo construtor, como tipos dos ports.
4. **Contrato HTTP**: schema TypeBox em `presentation/http/schemas/`, exportando
   também o tipo via `Static<typeof X>`. Adicione a `sharedSchemas` se for
   reutilizável no OpenAPI.
5. **Presenter**: `presentation/http/presenters/` traduz entidade → DTO do contrato.
6. **Controller**: recebe dados simples, devolve o DTO. Sem `FastifyRequest`/`FastifyReply`.
7. **Rota**: `presentation/http/routes/`, declarando `schema` com os schemas TypeBox.
8. **Registrar no composition root**: token em `main/tokens.ts`, factory em
   `main/container.ts`, campo em `AppDependencies` (definido em
   `presentation/http/server.ts` — o adaptador declara o que precisa).
9. **Mapear o erro**: se criou erro de domínio, adicione o `code` em
   `STATUS_BY_DOMAIN_CODE` (`presentation/http/error-mapper.ts`). Sem isso ele
   cai em 500 — de propósito.
10. **Testes**: unitário do use case (injeção manual, sem container) e integração
    via `buildServer(deps, { logger: false })` + `app.inject()`. Dublês em
    `src/test/fakes.ts`.

## Anti-padrões neste repo

- **Não use `container.resolve()` fora de `main/`.** É o padrão comum em exemplos
  de TSyringe + Fastify, e era o que este repo fazia antes — mas quebra o teste e
  esconde o grafo. Dependência chega por parâmetro.
- **Não use `@injectable()` / `@inject()`.** Não há `experimentalDecorators` no
  tsconfig; o wiring é `useFactory` em `main/container.ts`.
- **Não coloque `statusCode` em erro de domínio.** HTTP é decidido em
  `error-mapper.ts`.
- **Não escreva JSON Schema à mão.** Use TypeBox, senão perde a checagem de
  contrato em tempo de compilação.
- **Não esqueça o passo 8.** O wiring é manual; nada descobre use case sozinho, e
  a falha só aparece em runtime.
- **Imports relativos precisam da extensão `.js`** (`module: NodeNext`), inclusive
  apontando para arquivos `.ts`.

## Verificação

```bash
npm run check          # typecheck + lint + testes — o mesmo que roda no pre-commit
npm run test:coverage  # thresholds em vitest.config.ts
npm run build          # usa tsconfig.build.json; testes não vão para dist/
```

Rode `npm run check` antes de considerar uma tarefa concluída.

## Se este repo veio do template

Substitua o domínio de exemplo (`Product`) pelo seu, mantendo a estrutura e as
regras acima. Um segundo adaptador de entrada (worker, CLI, fila) entra como
`presentation/<nome>/` e reaproveita os mesmos use cases — não duplique regra de
negócio no adaptador.
