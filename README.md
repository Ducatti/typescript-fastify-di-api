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

```
src/
├── container.ts              # Configuração de DI
├── main.ts                  # Entry point
├── server.ts                # Inicialização Fastify
├── controllers/             # Lógica de requisições
├── services/                # Regra de negócio
├── repositories/            # Acesso a dados
├── routes/                  # Definição de rotas
├── logger/                  # Configuração de logs
├── test/                    # setup.ts + fakes.ts (dublês reutilizáveis)
├── types/                   # Tipos compartilhados
└── **/*.test.ts             # Testes ao lado do código que cobrem
docker/                       # Arquivos Docker
```

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

- **Unitários** — instanciam a classe direto (`new ProductService(repo, logger)`), sem container. Dublês em [src/test/fakes.ts](src/test/fakes.ts).
- **Integração** — `buildServer({ logger: false })` + `app.inject()`, exercitando rotas, schemas de serialização e error handler sem abrir porta.

Detalhe de configuração: o esbuild (transformador padrão do Vite) não implementa
`emitDecoratorMetadata`, de que o TSyringe depende. Por isso o
[vitest.config.ts](vitest.config.ts) usa `unplugin-swc` — assim o container
resolve as dependências nos testes exatamente como em produção.

## 🔗 Endpoints

### Health Check
```bash
GET /health
```
Verifica se a aplicação está rodando

### Produtos (exemplo)
```bash
GET /products        # Listar
POST /products       # Criar
GET /products/:id    # Obter um
PUT /products/:id    # Atualizar
DELETE /products/:id # Deletar
```

## 🏗️ Padrões Utilizados

- **Dependency Injection**: Componentes desacoplados via TSyringe
- **Repository Pattern**: Abstração de acesso a dados
- **Service Layer**: Lógica de negócio separada
- **Controller Layer**: Manipulação de requisições
- **Interface Contracts**: Tipos explícitos para dependências

## 📌 Notas

- O arquivo `.env` é específico de cada ambiente (não commitar)
- Use `docker/docker-compose.yml` para evitar exposição de variáveis
- Health check está em `/health` (configure conforme necessário)

## 📄 Licença

ISC
