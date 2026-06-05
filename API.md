# API — Library Management

## Visão Geral

Base URL: `http://localhost:3000`

Swagger UI: `http://localhost:3000/docs`

Dois recursos principais:

```
/books   → CRUD de livros
/genres  → CRUD de gêneros
```

---

## Como os endpoints se diferenciam (HTTP Methods)

| Método | Propósito | Comportamento |
|--------|-----------|---------------|
| **POST** | Criar | Cria um novo recurso. Body obrigatório. |
| **GET** | Listar | Retorna **todos** os recursos. Sem body. |
| **GET /:id** | Buscar | Retorna **um** recurso pelo UUID. |
| **PATCH** | Atualizar parcialmente | Body opcional. Só altera os campos enviados. |
| **DELETE** | Remover | Remove o recurso. Retorna `204 No Content`. |

---

## Genres

### POST /genres — Criar gênero

```json
// Body (JSON)
{
  "name": "Ficção"        // string, 2-80 caracteres, obrigatório
}

// Response 201
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Ficção",
  "created_at": "2026-06-05T16:00:00.000Z",
  "books": []
}
```

### GET /genres — Listar todos

```json
// Response 200
[
  {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Ficção",
    "created_at": "2026-06-05T16:00:00.000Z",
    "books": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "name": "1984",
        "genreId": "660e8400-e29b-41d4-a716-446655440001",
        "createdAt": "2026-06-05T16:00:00.000Z",
        "genreRelation": { ... }
      }
    ]
  }
]
```

> O campo `books` lista todos os livros daquele gênero.

### GET /genres/:id — Buscar por ID

```json
// Response 200
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Ficção",
  "created_at": "2026-06-05T16:00:00.000Z",
  "books": []
}

// Response 404 — não encontrado
{
  "message": "Gênero #<id> não encontrado",
  "error": "Not Found",
  "statusCode": 404
}
```

### PATCH /genres/:id — Atualizar parcialmente

```json
// Body — todos os campos são opcionais
{
  "name": "Fantasia"      // string, 2-80 caracteres, opcional
}

// Response 200
{
  "id": "660e8400-e29b-41d4-a716-446655440001",
  "name": "Fantasia",
  "created_at": "2026-06-05T16:00:00.000Z",
  "books": []
}

// Pode enviar body vazio {} — nada é alterado
```

### DELETE /genres/:id — Remover

```json
// Response 204 (sem body)

// Response 404
{
  "message": "Gênero #<id> não encontrado",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## Books

### POST /books — Criar livro

```json
// Body (JSON)
{
  "name": "1984",                       // string, 2-80 caracteres, obrigatório
  "genreId": "660e8400-e29b-41d4-a716-446655440001"   // UUID, opcional
}

// Response 201
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "1984",
  "genreId": "660e8400-e29b-41d4-a716-446655440001",
  "createdAt": "2026-06-05T16:00:00.000Z",
  "genreRelation": {
    "id": "660e8400-e29b-41d4-a716-446655440001",
    "name": "Ficção",
    "created_at": "...",
    "books": []
  }
}
```

> **Regras de négocio:**
> - `genreId` deve ser um UUID **válido** de um gênero existente
> - `genreId: null` é **rejeitado** (BadRequestException)
> - Se `genreId` não for enviado, o livro fica sem gênero
> - O campo `genreRelation` é populado automaticamente

### GET /books — Listar todos

```json
// Response 200
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "1984",
    "genreId": "660e8400-e29b-41d4-a716-446655440001",
    "createdAt": "2026-06-05T16:00:00.000Z",
    "genreRelation": {
      "id": "660e8400-e29b-41d4-a716-446655440001",
      "name": "Ficção"
    }
  }
]
```

### GET /books/:id — Buscar por ID

```json
// Response 200
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "1984",
  "genreId": "660e8400-e29b-41d4-a716-446655440001",
  "createdAt": "2026-06-05T16:00:00.000Z",
  "genreRelation": { ... }
}

// Response 404
{
  "message": "Livro #<id> não encontrado",
  "error": "Not Found",
  "statusCode": 404
}
```

### PATCH /books/:id — Atualizar parcialmente

```json
// Body — todos os campos são opcionais
{
  "name": "Animal Farm",                // string, opcional
  "genreId": "770e8400-e29b-41d4-a716-446655440002"   // UUID, opcional
}

// Response 200 — retorna o livro atualizado com as relações
```

> **Comportamento detalhado:**
> - Só altera os campos **enviados** no body
> - Se `genreId` não for enviado, o gênero **não é alterado**
> - `genreId: null` é **rejeitado** com BadRequestException
> - Para trocar de gênero, envie o UUID do novo gênero

### DELETE /books/:id — Remover

```json
// Response 204 (sem body)

// Response 404
{
  "message": "Livro #<id> não encontrado",
  "error": "Not Found",
  "statusCode": 404
}
```

---

## Validações (ValidationPipe)

Todas as validações são aplicadas **automaticamente** via `ValidationPipe` global com:

```ts
{
  whitelist: true,   // remove campos não declarados no DTO
  transform: true    // converte tipagens (ex: string → UUID)
}
```

| Campo | Validação |
|-------|-----------|
| `name` (Book) | `@IsString()`, `@MinLength(2)`, `@MaxLength(80)` |
| `genreId` (Book) | `@IsOptional()`, `@IsUUID()` |
| `name` (Genre) | `@IsString()`, `@MinLength(2)`, `@MaxLength(80)` |

---

## Exemplos com cURL

```bash
# Criar um gênero
curl -X POST http://localhost:3000/genres \
  -H "Content-Type: application/json" \
  -d '{"name": "Ficção"}'

# Criar um livro com gênero
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"name": "1984", "genreId": "660e8400-e29b-41d4-a716-446655440001"}'

# Listar todos os livros
curl http://localhost:3000/books

# Buscar livro por ID
curl http://localhost:3000/books/550e8400-e29b-41d4-a716-446655440000

# Atualizar apenas o nome do livro
curl -X PATCH http://localhost:3000/books/550e8400-e29b-41d4-a716-446655440000 \
  -H "Content-Type: application/json" \
  -d '{"name": "Animal Farm"}'

# Remover um gênero
curl -X DELETE http://localhost:3000/genres/660e8400-e29b-41d4-a716-446655440001
```
