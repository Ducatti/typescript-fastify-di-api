# Template TypeScript Fastify com Dependency Injection

Um template robusto e bem estruturado para criar aplicações **Fastify** em **TypeScript** com **Dependency Injection** usando TSyringe.

## 🚀 Stack

- **Node.js** 22 (LTS)
- **Fastify** 5.8.5 - Framework web rápido e eficiente
- **TypeScript** 6.0 - Type safety
- **TSyringe** - Lightweight Dependency Injection
- **Pino** - Logger rápido e estruturado
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
└── types/                   # Tipos compartilhados
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
| `npm run build` | Compila TypeScript |
| `npm test` | Executa testes (não configurado) |

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
