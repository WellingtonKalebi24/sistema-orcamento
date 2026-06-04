# Sistema de Orcamentos e Ordens de Servico

Aplicacao web para empresas de manutencao e assistencia tecnica, planejada com frontend React/Vite e API Node.js/Express, ambos em TypeScript, com PostgreSQL e Prisma.

## Estado Atual

Esta implementacao cobre a fundacao inicial (`T001` a `T012`): workspace, shell web, API com health check, ambiente PostgreSQL local, ferramentas de qualidade, Jest e utilitarios do contrato OpenAPI. Regras de negocio, Prisma e autenticacao entram nas proximas tarefas.

## Requisitos

- Node.js 24 LTS recomendado para desenvolvimento e implantacao.
- Node.js `>=22.12.0` aceito pelo scaffold atual e pelas ferramentas Vite utilizadas.
- npm 10 ou superior.
- Docker Desktop ou PostgreSQL 17 instalado localmente.

## Configuracao Local

1. Crie um arquivo `.env` a partir de `.env.example` e substitua segredos antes de qualquer deploy.
2. Instale dependencias:

```bash
npm install
```

3. Inicie os bancos de desenvolvimento e testes:

```bash
npm run db:up
```

4. Inicie API e frontend:

```bash
npm run dev
```

O frontend sera servido em `http://localhost:5173`. A API usa `http://localhost:3333` e oferece `GET /health`.

## Comandos

```bash
npm run build
npm run lint
npm run format:check
npm run typecheck
npm run test
npm run validate:openapi
npm run generate:api-types
npm run db:down
```

## Bancos Locais

| Ambiente         | Servico Docker  | Porta  | Banco            |
| ---------------- | --------------- | ------ | ---------------- |
| Desenvolvimento  | `postgres`      | `5432` | `orcamento`      |
| Integracao/Teste | `postgres-test` | `5433` | `orcamento_test` |

O schema Prisma e as migracoes serao implementados a partir da tarefa `T013`.

## Documentacao de Feature

- Plano: `specs/001-sistema-orcamentos/plan.md`
- Tarefas: `specs/001-sistema-orcamentos/tasks.md`
- Contrato inicial: `specs/001-sistema-orcamentos/contracts/openapi.yaml`
