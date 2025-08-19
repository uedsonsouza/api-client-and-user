# API Client and User

API em Node.js/Express para gerenciamento de Usuários, Clientes e Contatos, com:
- Autenticação JWT
- Upload de arquivos (Multer)
- Envio de e-mails (Nodemailer) + fila de jobs (Bee-Queue + Redis)
- ORM Sequelize (PostgreSQL)
- Integração Sentry
- Swagger para documentação

## Stack

- Node (ver `.nvmrc` – v22.18.0)
- Express
- Sequelize + PostgreSQL
- Redis (fila de jobs)
- Bee-Queue
- Nodemailer
- Yup (validação)
- JWT (auth)
- Swagger (docs)
- Sentry (monitoramento)


### Principais componentes:
- Models: User, Customer, Contacts, File
- Controllers: CRUD de usuários, clientes, contatos, upload e sessão
- Fila: jobs DummyJob e WelcomeEmailJob
- Middleware: auth (JWT)

## Autenticação

1. Criar usuário (POST /users) com nome, email, password, passwordConfirmation
2. Login em /sessions retorna token
3. Enviar Authorization: Bearer <token> nas demais rotas

## Fila e E-mails

Ao criar usuário: adiciona job WelcomeEmailJob na fila.
Executar worker em processo separado:
```
yarn queue
```

Config Redis em `src/config/redis.js`.

## Upload de Arquivos

Rota: `POST /files` (multipart/form-data)
Campo: `file`
Armazena no diretório `tmp/uploads`.
Model File registra `name` e `path`.

## Swagger

Ativado em `/api-docs`.
Ajustar `swaggerOptions.apis` para apontar para `src/routes.js` ou adicionar anotações em arquivos específicos.

## Sentry

Config em `src/config/sentry.js` usando `SENTRY_DSN`.
Desabilite em desenvolvimento removendo variável.

## Banco de Dados

### Migrations

Executar migrations:
```
npx sequelize-cli db:migrate
```

(Usa config em `src/config/database.js`)

## Variáveis de Ambiente

Copiar arquivo de exemplo:
```
cp .env.exemple .env
```

Preencher:
- APP_SECRET
- DB_HOST / DB_USER / DB_PASSWORD / DB_NAME
- REDIS_HOST / REDIS_PORT
- EMAIL_HOST / EMAIL_PORT / EMAIL_USER / EMAIL_PASSWORD
- SENTRY_DSN (opcional)

## Execução (Desenvolvimento)

Usando Docker para PostgreSQL + Redis:
```
docker compose up -d
```

Instalar dependências:
```
yarn install
```

Rodar migrations:
```
npx sequelize-cli db:migrate
```

Iniciar API:
```
yarn dev
```

Worker da fila (outro terminal):
```
yarn queue
```

Playground (scripts de teste de model):
```
yarn playground
```

## Scripts

- `yarn dev` – inicia servidor (nodemon)
- `yarn queue` – processa fila Bee-Queue
- `yarn playground` – roda script de testes com models
- `yarn test` – executa Jest (ainda sem testes implementados)

## Testes

Estrutura preparada em `__tests__/`, mas ainda sem specs. Sugestões:
- Testar fluxo de criação de usuário + login
- Testar CRUD de Customers/Contacts (incluindo filtros)
- Mock de fila e e-mail (usar jest.fn)

## Exemplo de Requisição

Criar usuário:
```
POST /users
{
  "name": "João Silva",
  "email": "joao@example.com",
  "password": "minhasenha123",
  "passwordConfirmation": "minhasenha123"
}
```

Login:
```
POST /sessions
{
  "email": "joao@example.com",
  "password": "minhasenha123"
}
```

Resposta:
```
{
  "user": { "id": 1, "name": "João Silva", "email": "joao@example.com" },
  "token": "..."
}
```

Listar clientes (autenticado):
```
GET /customers?name=acme&status=ACTIVE
Authorization: Bearer <token>
```