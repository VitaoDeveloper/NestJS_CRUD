# Summary — Library CRUD API

## Stack

| Tecnologia | Versão |
|------------|--------|
| NestJS | 11.1 |
| TypeORM | 1.0 |
| PostgreSQL | Neon.tech |
| TypeScript | 5.9 |
| Swagger | 11.4 |
| class-validator | 0.15 |
| Jest | 30.4 |

---

## Estrutura do Projeto

```
src/
├── main.ts                     # Bootstrap + ValidationPipe + Swagger
├── app.module.ts               # Módulo raiz (importa Books + Genres + TypeORM)
├── app.controller.ts           # GET / → "Hello World!"
├── app.service.ts
├── books/
│   ├── books.module.ts         # Módulo Books (importa GenresModule)
│   ├── books.controller.ts     # CRUD endpoints /books
│   ├── books.service.ts        # Lógica de negócio com TypeORM
│   ├── entities/
│   │   └── book.entity.ts      # Entidade Book (UUID, name, genreId, createdAt)
│   └── dto/
│       ├── create-book.dto.ts  # name (obrigatório), genreId (UUID, opcional)
│       └── update-book.dto.ts  # PartialType de CreateBookDto
├── genres/
│   ├── genres.module.ts        # Módulo Genres (exporta GenresService)
│   ├── genres.controller.ts    # CRUD endpoints /genres
│   ├── genres.service.ts       # Lógica de negócio + findByName()
│   ├── entities/
│   │   └── genre.entity.ts     # Entidade Genre (UUID, name, createdAt, books[])
│   └── dto/
│       ├── create-genre.dto.ts # name (obrigatório)
│       └── update-genre.dto.ts # PartialType de CreateGenreDto
├── swagger/
│   ├── swagger-config.ts       # Configuração (título, versão)
│   └── swagger-setup.ts        # Setup do Swagger UI em /docs
└── utils/
    └── app-validation.util.ts  # ValidationPipe (whitelist + transform)

test/
├── unit/
│   ├── books/
│   │   ├── books.service.spec.ts      # 14 testes (service isolado com mocks)
│   │   └── books.controller.spec.ts   # 6 testes (delegação ao service)
│   └── genres/
│       ├── genres.service.spec.ts     # 10 testes (service isolado com mocks)
│       └── genres.controller.spec.ts  # 6 testes (delegação ao service)
├── app.e2e-spec.ts                    # Teste end-to-end (requer DB)
└── jest-e2e.json                      # Config do e2e
```

---

## O que foi feito (alterações desta branch)

### 1. DTOs corrigidos

- **`create-book.dto.ts`**: `genre: string` → `genreId?: UUID` (com `@IsUUID()`)
- **`update-book.dto.ts`**: herda a correção via `PartialType`

### 2. Relacionamento Book ↔ Genre arrumado

**Antes** (quebrado):
```ts
// O DTO enviava o nome do gênero (string)
// O service validava mas nunca associava a relação
// genreId ficava sempre NULL no banco
```

**Depois** (funcional):
```ts
// DTO envia genreId (UUID)
// Service busca o Genre com findOne()
// Atribui book.genreRelation = genre
// TypeORM popula genre_id automaticamente
```

### 3. Regra de negócio: null rejeitado

```ts
// create e update rejeitam genreId: null
if (dto.genreId === null)
  throw new BadRequestException('genreId não pode ser nulo');
```

### 4. main.ts corrigido

- `useGlobalPipes()` movido para **antes** de `app.listen()`

### 5. Swagger corrigido

- Factory function substituída por `createDocument()` direto

### 6. Testes unitários (36 testes, 100% passando)

| Suite | Testes | O que cobre |
|-------|--------|-------------|
| BooksService | 14 | create, findAll, findOne, update, remove + casos de erro |
| BooksController | 6 | Delegação correta para cada método HTTP |
| GenresService | 10 | create, findAll, findOne, findByName, update, remove |
| GenresController | 6 | Delegação correta para cada método HTTP |

### 7. Testes movidos para `test/unit/`

- Arquivos `.spec.ts` removidos de `src/` e movidos para `test/unit/`
- `package.json` configurado com `roots: ["src", "test"]`
- `tsconfig.spec.json` criado para compatibilidade com ts-jest
- Imports absolutos via `moduleNameMapper` (`src/books/books.service`)

---

## Fluxo de dados atual

```
Cliente → HTTP Request → Controller → DTO (ValidationPipe) → Service → TypeORM → PostgreSQL

POST /books { name: "1984", genreId: "uuid" }
       │
       ▼
  CreateBookDto (ValidationPipe: name @IsString, genreId @IsUUID)
       │
       ▼
  BooksService.create()
       ├── dto.genreId === null? → BadRequestException
       ├── this.repo.create({ name })       → cria entidade base
       ├── this.genresService.findOne(id)    → busca Genre real
       └── book.genreRelation = genre        → TypeORM preenche genre_id
```

---

## Comandos úteis

```bash
# Iniciar servidor
pnpm run start:dev

# Rodar testes unitários
pnpm run test

# Ver coverage
pnpm run test:cov

# Type check
npx tsc --noEmit

# Lint
pnpm run lint

# Swagger UI
http://localhost:3000/docs
```

---

## Recursos da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/` | Health check |
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
| `GET` | `/docs` | Swagger UI |
