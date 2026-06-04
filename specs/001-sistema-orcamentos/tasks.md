# Tarefas: Sistema de Orcamentos e Ordens de Servico

**Entrada**: Documentos de desenho em `specs/001-sistema-orcamentos/`

**Prerequisitos**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/openapi.yaml](./contracts/openapi.yaml), [quickstart.md](./quickstart.md)

**Testes**: Obrigatorios neste projeto. A solicitacao tecnica exige Jest no backend, testes unitarios dos services principais e testes de integracao para autenticacao, orcamentos, ordens de servico e estoque.

**Organizacao**: As tarefas estao agrupadas por infraestrutura compartilhada e por historia de usuario. Autenticacao e persistencia ficam na fundacao porque bloqueiam todos os modulos protegidos. A US1 implementa os cadastros minimos necessarios para emitir um orcamento; a US3 amplia a operacao completa desses cadastros e do estoque.

## Formato: `[ID] [P?] [Story] Descricao`

- **[P]**: Pode ser executada em paralelo com outras tarefas sinalizadas na mesma fase, pois trabalha em arquivos distintos apos suas dependencias diretas.
- **[Story]**: Historia de usuario associada, usada somente nas fases de historias (`US1` a `US5`).
- Todos os itens indicam arquivos ou diretorios concretos a criar ou modificar.

## Phase 1: Setup (Infraestrutura Compartilhada)

**Objetivo**: Preparar workspace, projetos TypeScript, PostgreSQL local e comandos de qualidade para comecar o desenvolvimento.

- [X] T001 Criar workspace npm raiz e scripts coordenados de desenvolvimento, build, lint, tipos e testes em `package.json`
- [X] T002 [P] Criar exclusoes de artefatos, uploads e segredos locais em `.gitignore` e variaveis documentadas em `.env.example`
- [X] T003 [P] Configurar PostgreSQL de desenvolvimento e teste com volume local em `docker-compose.yml`
- [X] T004 Criar projeto backend Node.js/Express/TypeScript com dependencias do plano em `backend/package.json` e `backend/tsconfig.json`
- [X] T005 Criar bootstrap da API e endpoint publico de saude em `backend/src/app.ts`, `backend/src/server.ts` e `backend/src/routes/health.routes.ts`
- [X] T006 [P] Criar projeto frontend React/Vite/TypeScript com dependencias do plano em `frontend/package.json`, `frontend/vite.config.ts` e `frontend/src/main.tsx`
- [X] T007 [P] Configurar lint e formatacao compartilhada para frontend e backend em `eslint.config.js`, `.prettierrc` e `.prettierignore`
- [X] T008 [P] Configurar Jest, Supertest e ambiente de teste backend em `backend/jest.config.ts`, `backend/tests/setup-env.ts` e `backend/tests/helpers/test-app.ts`
- [X] T009 [P] Criar scripts para validar OpenAPI e futuramente gerar tipos do cliente em `scripts/validate-openapi.mjs` e `scripts/generate-api-types.mjs`
- [X] T010 Criar shell visual inicial responsivo e estilos globais do frontend em `frontend/src/App.tsx` e `frontend/src/styles/global.css`
- [X] T011 [P] Documentar inicializacao local, bancos e comandos previstos em `README.md`
- [X] T012 Instalar dependencias e registrar lockfile reproduzivel do workspace em `package-lock.json`

**Checkpoint**: `docker compose up`, API `/health`, Vite, lint, typecheck e Jest vazio devem iniciar com comandos consistentes.

---

## Phase 2: Foundational (Bloqueios para Todas as Historias)

**Objetivo**: Disponibilizar banco, seguranca, autenticacao, contrato base e infraestrutura de frontend exigidos por qualquer fluxo autenticado.

**Critico**: Nenhuma historia de usuario deve ser iniciada antes desta fase concluir, pois todos os dados sao protegidos e usam os mesmos modelos/transacoes.

- [ ] T013 Implementar enums, modelos, relacionamentos, decimais, soft delete e indices Prisma definidos no desenho em `backend/prisma/schema.prisma`
- [ ] T014 Criar migracao inicial com constraints SQL para vinculos XOR, unicidades e protecoes documentais em `backend/prisma/migrations/000001_initial_schema/migration.sql`
- [ ] T015 Criar seed reproduzivel com empresa inicial, administrador e dados demonstrativos basicos em `backend/prisma/seed.ts`
- [ ] T016 Configurar leitura validada de ambiente e cliente Prisma compartilhado em `backend/src/config/env.ts` e `backend/src/config/prisma.ts`
- [ ] T017 [P] Implementar envelope HTTP, `AppError`, request id e middleware de erros em `backend/src/utils/app-error.ts`, `backend/src/utils/api-response.ts`, `backend/src/middlewares/request-id.middleware.ts` e `backend/src/middlewares/error.middleware.ts`
- [ ] T018 [P] Implementar logger sem dados sensiveis, Helmet, CORS, limites de corpo e rate limit em `backend/src/config/logger.ts` e `backend/src/middlewares/security.middleware.ts`
- [ ] T019 [P] Implementar schemas comuns de paginacao/filtros e utilitarios seguros de decimal, documentos e datas em `backend/src/validators/common.schemas.ts`, `backend/src/utils/money.ts`, `backend/src/utils/documents.ts` e `backend/src/utils/dates.ts`
- [ ] T020 Implementar repositorios compartilhados de auditoria e sequencia numerica transacional em `backend/src/repositories/audit-log.repository.ts`, `backend/src/repositories/document-sequence.repository.ts` e `backend/src/services/audit.service.ts`
- [ ] T021 [P] Implementar abstracao de armazenamento local protegido para logos/anexos em `backend/src/providers/storage/storage-provider.ts` e `backend/src/providers/storage/local-storage.provider.ts`
- [ ] T022 Implementar schemas de login/refresh e providers de bcrypt/JWT/refresh opaco em `backend/src/validators/auth.schemas.ts`, `backend/src/providers/auth/password.provider.ts` e `backend/src/providers/auth/token.provider.ts`
- [ ] T023 Implementar persistencia e regras de sessao rotativa/revogavel em `backend/src/repositories/user.repository.ts`, `backend/src/repositories/refresh-token.repository.ts` e `backend/src/services/auth.service.ts`
- [ ] T024 Implementar endpoints de login, refresh, logout e usuario corrente com middlewares RBAC em `backend/src/controllers/auth.controller.ts`, `backend/src/routes/auth.routes.ts`, `backend/src/middlewares/authenticate.middleware.ts` e `backend/src/middlewares/authorize.middleware.ts`
- [ ] T025 [P] Escrever testes unitarios de credenciais, tokens e revogacao antes da estabilizacao da autenticacao em `backend/tests/unit/services/auth.service.spec.ts`
- [ ] T026 Escrever testes de integracao de login, refresh, logout e negacao por perfil em `backend/tests/integration/auth.routes.spec.ts`
- [ ] T027 Registrar as rotas versionadas e middlewares comuns na aplicacao Express em `backend/src/routes/index.ts` e `backend/src/app.ts`
- [ ] T028 [P] Gerar/consumir tipos iniciais do contrato e configurar cliente HTTP com renovacao controlada em `frontend/src/lib/api/schema.d.ts` e `frontend/src/lib/api/client.ts`
- [ ] T029 [P] Implementar estado de sessao em memoria, provider e formulario de login em `frontend/src/store/auth.store.ts`, `frontend/src/features/auth/AuthProvider.tsx` e `frontend/src/features/auth/pages/LoginPage.tsx`
- [ ] T030 Implementar roteamento protegido, matriz de permissao e layout com sidebar em `frontend/src/app/router.tsx`, `frontend/src/app/permissions.ts`, `frontend/src/components/layout/ProtectedRoute.tsx` e `frontend/src/components/layout/AppLayout.tsx`
- [ ] T031 Criar helpers de banco e fixtures autenticadas para testes de integracao em `backend/tests/helpers/database.ts` e `backend/tests/fixtures/auth.fixture.ts`
- [ ] T032 Executar e corrigir gates iniciais de migracao, seed, lint, typecheck e autenticacao em `backend/tests/integration/auth.routes.spec.ts` e `README.md`

**Checkpoint**: Banco migravel, login JWT/refresh funcionando, rotas protegidas e layout autenticado prontos para receber os incrementos.

---

## Phase 3: User Story 1 - Emitir Orcamento Profissional ao Cliente (Prioridade: P1) - MVP Inicial

**Objetivo**: Permitir que atendente cadastre/selecione cliente e itens, crie orcamento, envie/aprove/recuse e baixe PDF profissional sem movimentar estoque.

**Teste independente**: Com empresa e usuario semeados, cadastrar cliente e itens, montar orcamento de cinco linhas, marcar como enviado, baixar PDF e aprovar; nenhum registro de movimentacao de estoque deve existir.

### Testes para User Story 1

- [ ] T033 [P] [US1] Escrever testes unitarios dos calculos de itens, descontos, taxa, mao de obra, custo e lucro com decimal em `backend/tests/unit/services/quote-calculator.spec.ts`
- [ ] T034 [P] [US1] Escrever testes de integracao para criar, editar rascunho, enviar, aprovar/recusar/expirar e filtrar orcamentos sem baixa de estoque em `backend/tests/integration/quotes.routes.spec.ts`
- [ ] T035 [P] [US1] Escrever teste de integracao do download PDF e preservacao de snapshots apos alterar catalogo/empresa em `backend/tests/integration/quote-pdf.routes.spec.ts`

### Implementacao para User Story 1

- [ ] T036 [P] [US1] Implementar cadastro e consulta minima de clientes necessarios ao orcamento em `backend/src/validators/client.schemas.ts`, `backend/src/repositories/client.repository.ts`, `backend/src/services/client.service.ts`, `backend/src/controllers/client.controller.ts` e `backend/src/routes/client.routes.ts`
- [ ] T037 [P] [US1] Implementar consulta/criacao minima de produtos e servicos para selecao do orcamento em `backend/src/repositories/product.repository.ts`, `backend/src/repositories/service.repository.ts`, `backend/src/services/catalog.service.ts`, `backend/src/controllers/catalog.controller.ts` e `backend/src/routes/catalog.routes.ts`
- [ ] T038 [P] [US1] Implementar leitura interna de configuracao empresarial para snapshots e PDF em `backend/src/repositories/company-settings.repository.ts` e `backend/src/services/company-settings.service.ts`
- [ ] T039 [US1] Implementar validacao Zod dos itens e comandos de orcamento conforme OpenAPI em `backend/src/validators/quote.schemas.ts`
- [ ] T040 [US1] Implementar persistencia de orcamentos, itens, filtros e snapshots em `backend/src/repositories/quote.repository.ts`
- [ ] T041 [US1] Implementar calculadora decimal centralizada para precos, descontos, custo e lucro em `backend/src/services/quote-calculator.service.ts`
- [ ] T042 [US1] Implementar criacao, edicao de rascunho e transicoes de status auditadas sem movimentar estoque em `backend/src/services/quote.service.ts`
- [ ] T043 [US1] Expor endpoints de clientes/catalogo e orcamentos com RBAC de atendente/admin em `backend/src/controllers/quote.controller.ts`, `backend/src/routes/quote.routes.ts` e `backend/src/routes/index.ts`
- [ ] T044 [US1] Implementar PDFKit com layout A4, logo opcional, tabelas, aceite e rodape a partir de snapshots em `backend/src/providers/pdf/quote-pdf.provider.ts` e `backend/src/services/quote-pdf.service.ts`
- [ ] T045 [US1] Expor download autorizado do PDF com nome de arquivo consistente em `backend/src/controllers/quote-pdf.controller.ts` e `backend/src/routes/quote.routes.ts`
- [ ] T046 [P] [US1] Implementar formularios e busca minima de cliente para orcamento em `frontend/src/features/clients/pages/NewClientPage.tsx`, `frontend/src/features/clients/components/ClientPicker.tsx` e `frontend/src/features/clients/api/clients.api.ts`
- [ ] T047 [P] [US1] Implementar seletores de produto/servico e formatadores de moeda/CPF/CNPJ em `frontend/src/features/quotes/components/CatalogItemPicker.tsx`, `frontend/src/lib/formatters/currency.ts` e `frontend/src/lib/masks/documents.ts`
- [ ] T048 [US1] Implementar hooks de API e schema de formulario de orcamento em `frontend/src/features/quotes/api/quotes.api.ts` e `frontend/src/features/quotes/validation/quote.schema.ts`
- [ ] T049 [US1] Implementar pagina de novo orcamento com itens, descontos e resumo calculado em `frontend/src/features/quotes/pages/NewQuotePage.tsx` e `frontend/src/features/quotes/components/QuoteForm.tsx`
- [ ] T050 [P] [US1] Implementar listagem filtravel e detalhe com status/PDF em `frontend/src/features/quotes/pages/QuotesPage.tsx`, `frontend/src/features/quotes/pages/QuoteDetailPage.tsx` e `frontend/src/features/quotes/components/QuoteStatusActions.tsx`
- [ ] T051 [US1] Registrar rotas frontend e navegacao do modulo de orcamentos/clientes em `frontend/src/app/router.tsx` e `frontend/src/components/layout/AppSidebar.tsx`
- [ ] T052 [US1] Executar testes Jest de US1 e registrar roteiro manual do PDF/orcamento no MVP em `backend/tests/integration/quotes.routes.spec.ts`, `backend/tests/integration/quote-pdf.routes.spec.ts` e `README.md`

**Checkpoint**: O MVP comercial inicial emite e aprova orcamentos com PDF, sem alterar estoque, usando autenticacao e permissoes.

---

## Phase 4: User Story 2 - Executar Servico Aprovado e Consumir Pecas (Prioridade: P2)

**Objetivo**: Abrir OS manual ou a partir de orcamento aprovado, permitir atualizacao tecnica/anexos e concluir com baixa unica e atomica de pecas.

**Teste independente**: Converter um orcamento aprovado em OS, criar outra OS manual, atualizar execucao, anexar arquivo, concluir com saldo suficiente e confirmar uma unica baixa; repeticao e saldo insuficiente devem ser bloqueados.

### Testes para User Story 2

- [ ] T053 [P] [US2] Escrever testes unitarios para transicoes de OS, conversao unica e bloqueio apos conclusao em `backend/tests/unit/services/work-order.service.spec.ts`
- [ ] T054 [P] [US2] Escrever testes de integracao para OS manual, conversao de orcamento, tecnico e anexos autorizados em `backend/tests/integration/work-orders.routes.spec.ts`
- [ ] T055 [P] [US2] Escrever testes transacionais de conclusao, idempotencia, estoque insuficiente, saldo negativo configurado e concorrencia em `backend/tests/integration/work-order-completion.spec.ts`

### Implementacao para User Story 2

- [ ] T056 [US2] Implementar schemas de criacao, atualizacao, conclusao e anexos de OS em `backend/src/validators/work-order.schemas.ts` e `backend/src/validators/attachment.schemas.ts`
- [ ] T057 [US2] Implementar repositories de OS, itens, anexos e leitura de saldo para conclusao em `backend/src/repositories/work-order.repository.ts`, `backend/src/repositories/attachment.repository.ts` e `backend/src/repositories/stock-movement.repository.ts`
- [ ] T058 [US2] Implementar criacao manual, conversao unica e transicoes operacionais auditadas em `backend/src/services/work-order.service.ts`
- [ ] T059 [US2] Implementar conclusao serializavel com baixa unica por item, bloqueio de saldo e configuracao de negativo em `backend/src/services/work-order-completion.service.ts` e `backend/src/services/stock.service.ts`
- [ ] T060 [P] [US2] Implementar upload/download protegido de foto, documento e aceite em `backend/src/services/attachment.service.ts`, `backend/src/controllers/attachment.controller.ts` e `backend/src/routes/attachment.routes.ts`
- [ ] T061 [US2] Expor listagem, detalhe, criacao, conversao e conclusao de OS com permissoes contextuais do tecnico em `backend/src/controllers/work-order.controller.ts`, `backend/src/routes/work-order.routes.ts` e `backend/src/routes/index.ts`
- [ ] T062 [P] [US2] Implementar API e schemas frontend de OS/anexos em `frontend/src/features/work-orders/api/work-orders.api.ts` e `frontend/src/features/work-orders/validation/work-order.schema.ts`
- [ ] T063 [P] [US2] Implementar listagem e detalhe operacional da OS com timeline/status em `frontend/src/features/work-orders/pages/WorkOrdersPage.tsx`, `frontend/src/features/work-orders/pages/WorkOrderDetailPage.tsx` e `frontend/src/features/work-orders/components/WorkOrderStatusPanel.tsx`
- [ ] T064 [US2] Implementar formulario de OS manual e acao de conversao a partir do orcamento aprovado em `frontend/src/features/work-orders/pages/NewWorkOrderPage.tsx` e `frontend/src/features/quotes/components/CreateWorkOrderAction.tsx`
- [ ] T065 [US2] Implementar edicao tecnica de consumo real, anexos e conclusao com exibicao de erro de estoque em `frontend/src/features/work-orders/components/ExecutionForm.tsx` e `frontend/src/features/work-orders/components/AttachmentPanel.tsx`
- [ ] T066 [US2] Registrar rotas e navegacao de ordens para atendente/tecnico/admin em `frontend/src/app/router.tsx` e `frontend/src/components/layout/AppSidebar.tsx`
- [ ] T067 [US2] Executar suite de OS/estoque e documentar demonstracao de conclusao segura em `backend/tests/integration/work-order-completion.spec.ts` e `README.md`

**Checkpoint**: O ciclo aprovado -> execucao -> conclusao esta operacional, com estoque consistente sob repeticao e concorrencia.

---

## Phase 5: User Story 3 - Manter Cadastros e Estoque Operacional (Prioridade: P3)

**Objetivo**: Completar CRUD, inativacao, busca, disponibilidade e movimentos manuais dos cadastros que sustentam o atendimento.

**Teste independente**: Cadastrar/editar/inativar cliente, servico e produto, registrar entrada/saida/ajuste e verificar saldo, estoque baixo e historico do cliente/produto.

### Testes para User Story 3

- [ ] T068 [P] [US3] Escrever testes de integracao de CRUD, busca, inativacao e historico de clientes/servicos/produtos em `backend/tests/integration/catalogs.routes.spec.ts`
- [ ] T069 [P] [US3] Escrever testes unitarios e de integracao para entrada, saida, ajuste, saldo insuficiente e alerta minimo em `backend/tests/unit/services/stock.service.spec.ts` e `backend/tests/integration/stock.routes.spec.ts`

### Implementacao para User Story 3

- [ ] T070 [P] [US3] Completar validadores e services de edicao/inativacao/historico de clientes em `backend/src/validators/client.schemas.ts` e `backend/src/services/client.service.ts`
- [ ] T071 [P] [US3] Completar CRUD e inativacao do catalogo de servicos em `backend/src/validators/service.schemas.ts`, `backend/src/services/service.service.ts`, `backend/src/controllers/service.controller.ts` e `backend/src/routes/service.routes.ts`
- [ ] T072 [P] [US3] Completar CRUD, filtros e consulta de estoque baixo de produtos em `backend/src/validators/product.schemas.ts`, `backend/src/services/product.service.ts`, `backend/src/controllers/product.controller.ts` e `backend/src/routes/product.routes.ts`
- [ ] T073 [US3] Implementar movimentos manuais auditados e historico paginado de estoque em `backend/src/validators/stock.schemas.ts`, `backend/src/services/stock.service.ts`, `backend/src/controllers/stock.controller.ts` e `backend/src/routes/stock.routes.ts`
- [ ] T074 [US3] Implementar historico consolidado do cliente com orcamentos e ordens permitidas em `backend/src/services/client-history.service.ts` e `backend/src/controllers/client.controller.ts`
- [ ] T075 [P] [US3] Implementar telas completas de clientes com busca, formulario, inativacao e historico em `frontend/src/features/clients/pages/ClientsPage.tsx`, `frontend/src/features/clients/pages/ClientDetailPage.tsx` e `frontend/src/features/clients/components/ClientForm.tsx`
- [ ] T076 [P] [US3] Implementar telas de servicos com filtros, edicao e inativacao em `frontend/src/features/services/pages/ServicesPage.tsx` e `frontend/src/features/services/components/ServiceForm.tsx`
- [ ] T077 [P] [US3] Implementar produtos/estoque com alerta, movimentos e historico em `frontend/src/features/products/pages/ProductsPage.tsx`, `frontend/src/features/products/pages/StockMovementsPage.tsx` e `frontend/src/features/products/components/StockMovementForm.tsx`
- [ ] T078 [US3] Registrar navegacao e permissoes de cadastros/estoque no frontend em `frontend/src/app/router.tsx`, `frontend/src/app/permissions.ts` e `frontend/src/components/layout/AppSidebar.tsx`
- [ ] T079 [US3] Executar testes de cadastros/estoque e validar filtros/alerta minimo no roteiro local em `backend/tests/integration/stock.routes.spec.ts` e `README.md`

**Checkpoint**: Cadastros e estoque podem ser mantidos diariamente, preservando historicos usados por orcamentos e OS.

---

## Phase 6: User Story 4 - Acompanhar Recebimentos e Resultados (Prioridade: P4)

**Objetivo**: Registrar pagamentos e oferecer dashboard/relatorios de receita, custo, lucro, andamento e produtos consumidos.

**Teste independente**: Registrar pagamentos pendente, parcial e pago para trabalhos existentes e consultar dashboard por periodo, conferindo valores e restricao por perfil.

### Testes para User Story 4

- [ ] T080 [P] [US4] Escrever testes unitarios de situacao de pagamento, receita recebida e lucro estimado em `backend/tests/unit/services/payment.service.spec.ts` e `backend/tests/unit/services/dashboard.service.spec.ts`
- [ ] T081 [P] [US4] Escrever testes de integracao de pagamentos, relatorios, dashboard e protecao financeira em `backend/tests/integration/payments-dashboard.routes.spec.ts`

### Implementacao para User Story 4

- [ ] T082 [US4] Implementar schemas e repository de pagamentos vinculados exatamente a orcamento ou OS em `backend/src/validators/payment.schemas.ts` e `backend/src/repositories/payment.repository.ts`
- [ ] T083 [US4] Implementar regras de pagamento parcial/pago/cancelado e auditoria financeira em `backend/src/services/payment.service.ts`
- [ ] T084 [US4] Expor endpoints financeiros com RBAC de admin/financeiro em `backend/src/controllers/payment.controller.ts`, `backend/src/routes/payment.routes.ts` e `backend/src/routes/index.ts`
- [ ] T085 [US4] Implementar agregacoes filtradas de cards, graficos, recentes e produtos mais usados em `backend/src/repositories/dashboard.repository.ts` e `backend/src/services/dashboard.service.ts`
- [ ] T086 [US4] Implementar relatorios simples de orcamentos, OS, pagamentos, rentabilidade e estoque em `backend/src/services/report.service.ts`, `backend/src/controllers/report.controller.ts` e `backend/src/routes/report.routes.ts`
- [ ] T087 [US4] Expor dashboard com redacao de valores conforme papel em `backend/src/controllers/dashboard.controller.ts` e `backend/src/routes/dashboard.routes.ts`
- [ ] T088 [P] [US4] Implementar API, listagem e formulario de pagamentos em `frontend/src/features/payments/api/payments.api.ts`, `frontend/src/features/payments/pages/PaymentsPage.tsx` e `frontend/src/features/payments/components/PaymentForm.tsx`
- [ ] T089 [P] [US4] Implementar cards e graficos do dashboard em `frontend/src/features/dashboard/api/dashboard.api.ts`, `frontend/src/features/dashboard/pages/DashboardPage.tsx` e `frontend/src/features/dashboard/components/DashboardCharts.tsx`
- [ ] T090 [P] [US4] Implementar pagina de relatorios com periodo e exportacao visual basica em `frontend/src/features/reports/pages/ReportsPage.tsx` e `frontend/src/features/reports/api/reports.api.ts`
- [ ] T091 [US4] Registrar rotas/menu financeiro com visibilidade por papel em `frontend/src/app/router.tsx`, `frontend/src/app/permissions.ts` e `frontend/src/components/layout/AppSidebar.tsx`
- [ ] T092 [US4] Executar testes financeiros/dashboard e validar indicadores do roteiro de demonstracao em `backend/tests/integration/payments-dashboard.routes.spec.ts` e `README.md`

**Checkpoint**: Gestao acompanha dinheiro e operacao do periodo sem expor informacao financeira a perfis nao autorizados.

---

## Phase 7: User Story 5 - Administrar Empresa, Usuarios e Acesso (Prioridade: P5)

**Objetivo**: Completar administracao de usuarios, identidade documental, logo e configuracao sensivel de estoque negativo.

**Teste independente**: Criar usuarios dos quatro perfis, alterar dados/logo da empresa, verificar novo PDF e tentar acessar modulos/valores com cada papel.

### Testes para User Story 5

- [ ] T093 [P] [US5] Escrever testes de integracao de CRUD/inativacao de usuarios, perfis e bloqueio de acesso direto em `backend/tests/integration/users-authorization.routes.spec.ts`
- [ ] T094 [P] [US5] Escrever testes de configuracoes, upload de logo e auditoria de estoque negativo em `backend/tests/integration/company-settings.routes.spec.ts`

### Implementacao para User Story 5

- [ ] T095 [US5] Implementar schemas, service e endpoints administrativos de usuarios sem expor hash de senha em `backend/src/validators/user.schemas.ts`, `backend/src/services/user.service.ts`, `backend/src/controllers/user.controller.ts` e `backend/src/routes/user.routes.ts`
- [ ] T096 [US5] Completar edicao de configuracoes, upload de logo e auditoria de `allowNegativeStock` em `backend/src/validators/company-settings.schemas.ts`, `backend/src/services/company-settings.service.ts`, `backend/src/controllers/company-settings.controller.ts` e `backend/src/routes/company-settings.routes.ts`
- [ ] T097 [P] [US5] Implementar tela administrativa de usuarios e perfis em `frontend/src/features/users/api/users.api.ts`, `frontend/src/features/users/pages/UsersPage.tsx` e `frontend/src/features/users/components/UserForm.tsx`
- [ ] T098 [P] [US5] Implementar configuracoes da empresa, logo e opcao protegida de estoque negativo em `frontend/src/features/settings/api/settings.api.ts`, `frontend/src/features/settings/pages/CompanySettingsPage.tsx` e `frontend/src/features/settings/components/CompanySettingsForm.tsx`
- [ ] T099 [US5] Refinar matriz de permissoes, menus e respostas de acesso negado para os quatro perfis em `frontend/src/app/permissions.ts`, `frontend/src/components/layout/AppSidebar.tsx` e `frontend/src/components/feedback/ForbiddenPage.tsx`
- [ ] T100 [US5] Executar suite de RBAC/configuracoes e validar PDF com identidade atualizada em `backend/tests/integration/users-authorization.routes.spec.ts`, `backend/tests/integration/company-settings.routes.spec.ts` e `README.md`

**Checkpoint**: Administrador controla identidade e acessos; perfis operacionais executam apenas as funcoes autorizadas.

---

## Phase 8: Polish e Implantacao Inicial

**Objetivo**: Endurecer o MVP completo, garantir operacao responsiva e preparar publicacao controlada.

- [ ] T101 [P] Validar e sincronizar contrato OpenAPI com schemas reais e tipos frontend em `specs/001-sistema-orcamentos/contracts/openapi.yaml`, `scripts/validate-openapi.mjs` e `frontend/src/lib/api/schema.d.ts`
- [ ] T102 [P] Configurar React Testing Library com executor compativel com Vite e implementar testes essenciais da interface em `frontend/vitest.config.ts`, `frontend/src/test/setup.ts`, `frontend/src/features/auth/LoginPage.spec.tsx`, `frontend/src/features/quotes/QuoteForm.spec.tsx`, `frontend/src/features/work-orders/WorkOrderDetailPage.spec.tsx` e `frontend/src/features/dashboard/DashboardPage.spec.tsx`
- [ ] T103 Executar testes de carga basica para listagens/dashboard e ajustar indices somente com evidencia em `backend/tests/performance/dashboard-load.spec.ts` e `backend/prisma/schema.prisma`
- [ ] T104 [P] Revisar acessibilidade, mascaras, feedbacks de erro e responsividade das rotas essenciais em `frontend/src/styles/global.css` e `frontend/src/components/feedback/`
- [ ] T105 [P] Endurecer uploads, logs, CORS, rate limit e politica de segredos para producao em `backend/src/middlewares/security.middleware.ts`, `backend/src/providers/storage/local-storage.provider.ts` e `.env.example`
- [ ] T106 Criar conteinerizacao e configuracao de execucao inicial do frontend/backend em `backend/Dockerfile`, `frontend/Dockerfile` e `docker-compose.production.yml`
- [ ] T107 Criar pipeline automatizado de lint, typecheck, migracao de teste e suites Jest em `.github/workflows/ci.yml`
- [ ] T108 Preparar migracao/seed controlados, backup e checklist de deploy inicial em `backend/prisma/seed.ts` e `docs/deployment.md`
- [ ] T109 Executar roteiro completo de aceite e registrar resultados do MVP em `specs/001-sistema-orcamentos/quickstart.md` e `docs/acceptance-report.md`
- [ ] T110 Atualizar documentacao final de operacao, perfis, PDF, estoque e comandos em `README.md` e `docs/user-guide.md`

**Checkpoint**: Suite e aceite aprovados, artefatos de deploy preparados e MVP pronto para implantacao inicial controlada.

---

## Dependencias e Ordem de Execucao

### Dependencias por Fase

- **Phase 1 - Setup**: inicia imediatamente.
- **Phase 2 - Foundational**: depende do Setup e bloqueia todos os fluxos funcionais.
- **Phase 3 - US1/P1**: depende da fundacao; entrega o primeiro MVP comercial demonstravel.
- **Phase 4 - US2/P2**: depende da fundacao e utiliza orcamento aprovado da US1 para o fluxo convertido; tambem e testavel por OS manual.
- **Phase 5 - US3/P3**: depende da fundacao; amplia os cadastros minimos iniciados na US1 e integra com baixa ja provada pela US2.
- **Phase 6 - US4/P4**: depende de orcamentos e ordens concluidas para medir receita/custo/lucro de forma representativa.
- **Phase 7 - US5/P5**: depende da autenticacao fundacional e completa administracao/configuracoes utilizadas pelos fluxos anteriores.
- **Phase 8 - Polish e Implantacao**: depende das historias que compoem a entrega a publicar.

### Dependencias entre Historias

```text
Setup -> Foundational -> US1 (orcamento + PDF, MVP inicial)
                    |-> US2 (OS manual testavel; conversao integra US1)
                    |-> US3 (cadastros/estoque completo; amplia base de US1/US2)
US1 + US2 + US3 -----> US4 (financeiro/dashboard com dados reais)
Foundational + US1 --> US5 (usuarios/configuracao/identidade PDF)
US1 + US2 + US3 + US4 + US5 -> Polish/Implantacao
```

### Paralelismo Seguro

- Apos `T001`, as configuracoes locais marcadas `[P]` no Setup podem ocorrer simultaneamente.
- Na fundacao, erro/log/seguranca, storage e frontend auth podem avancar em paralelo depois de schema/config essenciais.
- Em cada historia, os testes marcados `[P]` devem ser escritos primeiro e podem ser preparados simultaneamente.
- US2 manual e US3 podem iniciar depois da fundacao em equipes separadas, mas sua integracao completa deve ser validada depois da US1.
- Telas distintas marcadas `[P]` podem ser implementadas em paralelo apos contratos/services associados existirem.

## Exemplos de Execucao Paralela

### User Story 1

```text
Paralelo inicialmente: T033 (calculos), T034 (rotas de orcamento), T035 (PDF/snapshots).
Depois dos services: T046 (cliente), T047 (seletores/mascaras) e T050 (listagem/detalhe).
```

### User Story 2

```text
Paralelo inicialmente: T053 (regras de OS), T054 (rotas/anexos), T055 (transacao de estoque).
Depois dos endpoints: T062 (API/schema) e T063 (listagem/detalhe).
```

### User Story 3

```text
Paralelo inicialmente: T068 (CRUD/historicos) e T069 (movimentos/alerta).
Depois do backend: T075 (clientes), T076 (servicos) e T077 (produtos/estoque).
```

### User Story 4

```text
Paralelo inicialmente: T080 (unidades) e T081 (integracao/RBAC).
Depois dos endpoints: T088 (pagamentos), T089 (dashboard) e T090 (relatorios).
```

### User Story 5

```text
Paralelo inicialmente: T093 (usuarios/perfis) e T094 (configuracoes/logo).
Depois das APIs: T097 (usuarios) e T098 (empresa/configuracao).
```

## Estrategia de Implementacao

### Primeiro Ciclo: Comecar a Implementacao

1. Executar `T001` a `T012` para obter frontend/backend inicializaveis e PostgreSQL local.
2. Executar `T013` a `T032` para fechar banco, autenticacao, protecoes e shell da aplicacao.
3. Executar `T033` a `T052` para entregar o MVP inicial de orcamento com PDF.
4. Parar no checkpoint de US1 e demonstrar que criar/aprovar PDF nao altera estoque.

### Entrega Incremental

1. **MVP comercial**: Setup + Foundational + US1.
2. **MVP operacional**: adicionar US2 para executar OS e consumir pecas corretamente.
3. **Operacao diaria**: adicionar US3 para administrar catalogos e estoque.
4. **Gestao**: adicionar US4 para financeiro e dashboard.
5. **Governanca e publicacao**: adicionar US5 e Polish/Implantacao.

### Definition of Done por Tarefa

- Arquivo indicado criado ou modificado mantendo as camadas do plano.
- Testes associados escritos antes da regra critica e passando ao final do incremento.
- Endpoint, quando aplicavel, consistente com `contracts/openapi.yaml`.
- Nenhum controller contem calculos ou acesso Prisma direto; nenhum route acessa banco.
- Operacoes de estoque, dinheiro, autenticacao e permissao incluem erro seguro e auditoria quando previsto.

## Resumo de Cobertura

| Incremento | Tarefas | Resultado independente |
|------------|---------|------------------------|
| Setup | T001-T012 | Projetos e ambiente executaveis |
| Foundational | T013-T032 | Banco, auth/RBAC, seguranca e layout autenticado |
| US1 | T033-T052 | Orcamento profissional com PDF sem baixa de estoque |
| US2 | T053-T067 | OS e conclusao com baixa atomica/idempotente |
| US3 | T068-T079 | Cadastros e movimentos manuais completos |
| US4 | T080-T092 | Pagamentos, relatorios e dashboard |
| US5 | T093-T100 | Usuarios, empresa e permissoes administrativas |
| Polish/Implantacao | T101-T110 | Hardening, CI, deploy e aceite final |
