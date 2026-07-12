# Sistema de Orcamentos e Ordens de Servico

Aplicacao web para empresas de manutencao e assistencia tecnica, planejada com frontend React/Vite e API Node.js/Express, ambos em TypeScript, com PostgreSQL e Prisma.

## Estado Atual

Esta implementacao cobre `T001` a `T110`: workspace, API Express versionada, Prisma schema/migration/seed, JWT com refresh token, RBAC, clientes, catalogos de servicos e produtos, estoque manual, orcamentos com PDF, ordens de servico, baixa automatica de estoque, anexos, pagamentos, dashboard, relatorios basicos, usuarios, configuracoes da empresa, logo, CI, conteinerizacao e documentacao de deploy/uso.

## Requisitos

- Node.js 24 LTS recomendado para desenvolvimento e implantacao.
- Node.js `>=22.12.0` aceito pelo scaffold atual e pelas ferramentas Vite utilizadas.
- npm 10 ou superior.
- Docker Desktop ou PostgreSQL 17 instalado localmente.

## Configuracao Local

### Demonstracao rapida para cliente

Em Windows, a forma mais simples de abrir o sistema para apresentacao e executar:

```bat
iniciar-demo-windows.bat
```

O script instala dependencias na primeira execucao, cria `.env` se necessario, inicia API e frontend e abre o navegador em `http://localhost:5173/login`.

Login de demonstracao:

- E-mail: `admin@sistema.local`
- Senha: `Admin@12345`

Para encerrar os processos da demonstracao:

```bat
parar-demo-windows.bat
```

Guia completo: `docs/demo-cliente.md`.

### Desenvolvimento com banco PostgreSQL

1. Crie um arquivo `.env` a partir de `.env.example` e substitua segredos antes de qualquer deploy.
2. Instale dependencias:

```bash
npm install
```

3. Inicie os bancos de desenvolvimento e testes:

```bash
npm run db:up
```

4. Gere o Prisma Client, aplique a migracao e execute o seed:

```bash
npm run prisma:generate --workspace backend
npm run prisma:migrate --workspace backend
npm run prisma:seed --workspace backend
```

5. Inicie API e frontend:

```bash
npm run dev
```

O frontend sera servido em `http://localhost:5173`. A API usa `http://localhost:3333` e oferece `GET /health` e `GET /api/v1/health`.

Usuario inicial do seed:

- E-mail: `admin@sistema.local`
- Senha: `Admin@12345`

Usuarios adicionais do seed:

- `atendente@sistema.local`, `tecnico@sistema.local`, `financeiro@sistema.local`
- Senha: `Usuario@12345`

## Roteiro Rapido para Testar

1. Entrar em `http://localhost:5173/login`.
2. Cadastrar um cliente em **Clientes**.
3. Abrir **Novo orcamento**.
4. Selecionar cliente, adicionar um servico/produto do catalogo seedado e salvar.
5. Abrir o detalhe do orcamento, mudar status para `ENVIADO` e depois `APROVADO`.
6. Baixar o PDF pelo botao **Baixar PDF**.
7. Com o orcamento aprovado, clicar em **Gerar ordem de servico**.
8. Abrir **Ordens de servico**, acompanhar status, enviar anexos e concluir a OS.
9. Ao concluir a OS, os produtos usados sao baixados do estoque e a movimentacao fica registrada.
10. Abrir **Produtos** para manter pecas, saldos e alerta de estoque baixo.
11. Abrir **Estoque** para registrar entrada, saida ou ajuste manual com historico.
12. Abrir **Financeiro** para registrar pagamentos vinculados a orcamento ou OS.
13. Conferir **Dashboard** e **Relatorios** para indicadores operacionais e financeiros.
14. Abrir **Usuarios** para administrar perfis.
15. Abrir **Empresa** para configurar dados, logo, Pix, textos do PDF e estoque negativo.

Observacao: a criacao/aprovacao de orcamento nao movimenta estoque; a baixa automatica acontece somente ao concluir a ordem de servico ou por movimentacao manual futura.

## Rotas Implementadas da Fase 4

- `GET /api/v1/work-orders`
- `POST /api/v1/work-orders`
- `GET /api/v1/work-orders/:id`
- `PATCH /api/v1/work-orders/:id`
- `POST /api/v1/quotes/:id/work-order`
- `POST /api/v1/work-orders/:id/complete`
- `GET /api/v1/work-orders/:id/attachments`
- `POST /api/v1/work-orders/:id/attachments`
- `GET /api/v1/work-orders/attachments/:id/download`
- `GET /api/v1/attachments/:id/download`

## Rotas Implementadas das Fases 5 e 6

- `GET/POST /api/v1/clients`, `GET/PATCH/DELETE /api/v1/clients/:id`, `GET /api/v1/clients/:id/history`
- `GET/POST /api/v1/services`, `GET/PATCH/DELETE /api/v1/services/:id`
- `GET/POST /api/v1/products`, `GET /api/v1/products/low-stock`, `GET/PATCH/DELETE /api/v1/products/:id`
- `GET /api/v1/stock-movements`, `POST /api/v1/products/:id/stock-movements`
- `GET/POST /api/v1/payments`, `PATCH /api/v1/payments/:id`
- `GET /api/v1/dashboard/summary`
- `GET /api/v1/reports`

## Rotas Implementadas da Fase 7

- `GET/POST /api/v1/users`, `GET/PATCH/DELETE /api/v1/users/:id`
- `GET/PATCH /api/v1/company-settings`
- `POST /api/v1/company-settings/logo`

## Deploy e Operacao

- Deploy inicial: `docs/deployment.md`
- Guia do usuario: `docs/user-guide.md`
- Relatorio de aceite: `docs/acceptance-report.md`

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

O schema Prisma esta em `backend/prisma/schema.prisma` e a primeira migracao em `backend/prisma/migrations/000001_initial_schema/migration.sql`.

> Nota local: neste ambiente Windows, o download dos engines do Prisma retornou 404 pelo mirror `binaries.prisma.sh`; por isso os gates executados aqui evitaram depender de `prisma generate`. Em uma maquina com acesso normal ao mirror, rode os comandos Prisma acima antes de iniciar a API.

## Documentacao de Feature

- Plano: `specs/001-sistema-orcamentos/plan.md`
- Tarefas: `specs/001-sistema-orcamentos/tasks.md`
- Contrato inicial: `specs/001-sistema-orcamentos/contracts/openapi.yaml`
