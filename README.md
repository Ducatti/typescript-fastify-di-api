# Template TypeScript Fastify com Dependency Injection

Um template robusto e bem estruturado para criar aplicações **Fastify** em **TypeScript** com **Dependency Injection** usando TSyringe.

## 🚀 Stack

- **Node.js** 22 (LTS)
- **Fastify** 5.8.5 - Framework web rápido e eficiente
- **TypeScript** 6.0 - Type safety
- **TSyringe** - Lightweight Dependency Injection
- **Pino** - Logger rápido e estruturado
- **Vitest** - Testes unitários e de integração
- **Docker** - Containerização

## 📋 Pré-requisitos

- Node.js 22+
- npm 10+
- Docker 20.10+ (opcional, para containerização)

## 🛠️ Instalação e Uso Local

### Instalar dependências
```bash
npm install
```

### Desenvolver
```bash
npm run dev
```
Inicia o servidor em modo watch na porta `3000` (configurável via `.env`)

### Build
```bash
npm run build
```
Compila TypeScript para JavaScript em `dist/`

## 🐳 Docker

### Quick Start
```bash
# Com Docker Compose (recomendado)
docker-compose -f docker/docker-compose.yml up -d

# Ver logs
docker-compose -f docker/docker-compose.yml logs -f app
```

### Build Manual
```bash
docker build -f docker/Dockerfile -t meu-app .
docker run -p 3000:3000 --env-file .env meu-app
```

**Características:**
- Multi-stage build (otimizado para produção)
- Node 22-Alpine (imagem leve)
- Usuário não-root por segurança
- Health check automático

## 📁 Estrutura do Projeto

> Trabalhando neste repo com um agente de código? As regras operacionais estão em
> [CLAUDE.md](CLAUDE.md) — receita para adicionar endpoint, anti-padrões e verificação.

Clean Architecture / ports & adapters. As pastas indicam **distância do domínio**,
não tipo técnico:

```
src/
├── domain/                    # camada mais interna — zero framework
│   ├── entities/              #   Product: dado imutável + invariantes na factory
│   └── errors/                #   erros de domínio, sem statusCode
├── application/               # casos de uso
│   ├── ports/                 #   contratos que a aplicação EXIGE
│   └── use-cases/             #   uma classe, um execute()
├── infrastructure/            # adaptadores de saída (driven)
│   ├── persistence/           #   implementa ProductRepository
│   └── logging/               #   implementa Logger
├── presentation/              # adaptadores de entrada (driving)
│   └── http/                  #   controllers, rotas, schemas, presenters,
│                              #   error-mapper, server
├── main/                      # composition root
│   ├── container.ts           #   único lugar que conhece implementações
│   ├── tokens.ts
│   └── main.ts                #   entry point
├── test/                      # dublês reutilizáveis
└── **/*.test.ts               # testes ao lado do código que cobrem
docker/                        # arquivos Docker
```

**Regra de dependência** — só aponta para dentro:

```
presentation ─┐
              ├─> application ──> domain
infrastructure┘
```

Só `main/` importa de todas as camadas. A regra **é verificada no lint**
(`no-restricted-imports` por camada em [eslint.config.mjs](eslint.config.mjs)):
`domain` importando `pino`, ou `application` importando um adaptador, quebra o
`npm run lint` — e portanto o pre-commit e o CI.

Consequência prática: `presentation/http/` é uma pasta removível. Um segundo
adaptador de entrada (worker, CLI, fila) entra como `presentation/<nome>/` e
reaproveita os mesmos use cases, sem tocar no núcleo.

## ⚙️ Variáveis de Ambiente

Crie um arquivo `.env` baseado em `.env.example`:

```env
PORT=3000
```

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run dev` | Inicia servidor em modo desenvolvimento |
| `npm run build` | Compila TypeScript para `dist/` (sem os testes) |
| `npm run typecheck` | Checa tipos de todo o `src/`, testes inclusos |
| `npm run lint` / `lint:fix` | ESLint |
| `npm test` | Roda a suíte uma vez |
| `npm run test:watch` | Modo watch |
| `npm run test:coverage` | Roda com cobertura (thresholds no `vitest.config.ts`) |
| `npm run check` | typecheck + lint + test (usado no pre-commit) |

## 🧪 Testes

Vitest, com os testes ao lado do código (`*.test.ts`). Dois níveis:

- **Unitários** — instanciam a classe direto (`new GetProductUseCase(repo, logger)`),
  sem container e sem framework. Dublês em [src/test/fakes.ts](src/test/fakes.ts).
- **Integração** — `buildServer(deps, { logger: false })` + `app.inject()`,
  exercitando rotas, serialização dos schemas e error handler sem abrir porta.

Como o grafo é recebido por parâmetro, montar um cenário de falha é passar outro
objeto — não existe container global para mutar. Ver
[server.error-handler.test.ts](src/presentation/http/server.error-handler.test.ts).

## 🔒 Contrato HTTP verificado em compilação

Os schemas são TypeBox e alimentam o type provider do Fastify, então schema e
tipo são definidos uma vez só. Um handler que devolva payload fora do contrato
não compila:

```
error TS2322: Type 'Promise<{ name: string; id: string; price: number; }>'
is not assignable to type '... | { data: unknown } | ...'
```

O envelope é checado na rota; a forma interna do DTO é checada no controller,
cujo retorno é o tipo derivado do schema (`Static<typeof ProductResponseSchema>`).

## 🔗 Endpoints

### Health Check
```bash
GET /health
```
Verifica se a aplicação está rodando

### Produtos (exemplo)
```bash
GET /products        # Listar  -> { data, total }
GET /products/:id    # Obter um -> { data } | 404 { error }
```

## 🏗️ Padrões Utilizados

- **Clean Architecture**: camadas por distância do domínio, dependência só para dentro
- **Ports & Adapters**: o port mora na camada que o exige; o adaptador, fora
- **Dependency Injection**: wiring explícito no composition root via TSyringe —
  sem decorators, então domínio e aplicação não importam o container
- **Use Cases**: uma classe, um `execute()`
- **Presenter**: entidade → contrato HTTP, isolando o formato de resposta
- **Error Mapping**: erro de domínio não conhece HTTP; a borda traduz `code` em status

## 📌 Notas

- O arquivo `.env` é específico de cada ambiente (não commitar)
- Use `docker/docker-compose.yml` para evitar exposição de variáveis
- Health check está em `/health` (configure conforme necessário)

## 📄 Licença

ISC
