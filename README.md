# Library API

CRUD de livros e gêneros com NestJS + TypeORM + PostgreSQL.

## Stack

NestJS 11, TypeORM, PostgreSQL (Neon.tech), Swagger, class-validator, Jest.

## Setup

```bash
pnpm install
```

Copie `.env.example` para `.env` e preencha `DATABASE_URL` com sua connection string PostgreSQL.

## Comandos

```bash
pnpm run start:dev    # servidor em http://localhost:3000
pnpm run test         # 36 testes unitários
pnpm run test:cov     # cobertura
npx tsc --noEmit      # type check
pnpm run lint         # eslint
```

## Rotas

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/genres` | Criar gênero |
| `GET` | `/genres` | Listar gêneros |
| `GET` | `/genres/:id` | Buscar gênero |
| `PATCH` | `/genres/:id` | Atualizar gênero |
| `DELETE` | `/genres/:id` | Remover gênero |
| `POST` | `/books` | Criar livro |
| `GET` | `/books` | Listar livros |
| `GET` | `/books/:id` | Buscar livro |
| `PATCH` | `/books/:id` | Atualizar livro |
| `DELETE` | `/books/:id` | Remover livro |

Documentação interativa em `/docs` (Swagger UI).

## Estrutura

```
src/
├── books/       # CRUD de livros (entity, dto, service, controller, module)
├── genres/      # CRUD de gêneros (entity, dto, service, controller, module)
├── swagger/     # Configuração do Swagger
└── utils/       # ValidationPipe global
test/unit/       # Testes unitários (36)
```

## Documentação

- [`API.md`](./API.md) — Tutorial de requisições com exemplos
- [`SUMMARY.md`](./SUMMARY.md) — Sumário detalhado do projeto
