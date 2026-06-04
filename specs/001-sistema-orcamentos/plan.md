# Plano de Implementacao: Sistema de Orcamentos e Ordens de Servico

**Branch**: `001-sistema-orcamentos` | **Data**: 2026-05-23 | **Spec**: [spec.md](./spec.md)

**Entrada**: Especificacao funcional e solicitacao tecnica para React + Vite, Node.js + Express, TypeScript, Prisma, PostgreSQL, JWT e Jest.

## 1. Visao Geral do Sistema

Aplicacao web administrativa, em portugues do Brasil, para uma empresa unica de manutencao ou prestacao de servicos. O produto integra cadastro de clientes, catalogos, orcamentos com PDF, execucao por ordem de servico (OS), estoque, recebimentos e indicadores gerenciais.

A entrega sera um monorepo leve com `frontend/` e `backend/`, API REST versionada em `/api/v1`, autenticacao JWT e persistencia PostgreSQL por Prisma. A regra central e transacional: orcamento nunca consome estoque; a OS consome pecas uma unica vez ao ser concluida.

## 2. Escopo do MVP

- Login, renovacao de sessao, logout, usuarios e perfis `ADMIN`, `ATENDENTE`, `TECNICO` e `FINANCEIRO`.
- Configuracao da empresa, logo e textos utilizados no PDF.
- CRUD com inativacao de clientes, produtos e servicos; historico por cliente.
- Estoque com entradas, saidas, ajustes, baixa por OS, alertas e consulta de movimentacoes.
- Orcamentos com itens de produto/servico, descontos, custos, status, filtros e PDF para download.
- OS manual ou derivada de um unico orcamento aprovado, atribuicao de tecnico, anexos e conclusao com consumo transacional.
- Pagamentos manuais, situacao financeira basica, receita, custos e lucro estimado.
- Dashboard com cards, graficos e listas recentes filtrados por permissao.
- API documentada, validacao, logs, tratamento de erros, testes unitarios e integracao de rotas criticas.

## 3. Escopo Futuro

- Envio do PDF por e-mail ou WhatsApp e portal de aprovacao/assinatura externa.
- Recuperacao de senha, autenticacao multifator e provedor de identidade.
- Emissao fiscal, conciliacao bancaria, cobranca automatizada e contas a pagar.
- Agenda de tecnicos, notificacoes, aplicativo offline e atendimento em campo.
- Multiempresa, filiais, compras, fornecedores completos e reserva de estoque no agendamento.
- Armazenamento de anexos em objeto distribuido e processamento assincrono de documentos em escala.

## 4. Arquitetura Geral

### Technical Context

**Linguagem/versao**: TypeScript no frontend e backend; Node.js 24 LTS para API e ferramentas.

**Dependencias principais**: React com Vite, React Router, TanStack Query, Zustand, React Hook Form e Zod no frontend; Express 5, Prisma Client, Zod, `jose`, `bcrypt`, PDFKit, Multer, Pino, Helmet e `express-rate-limit` no backend.

**Armazenamento**: PostgreSQL 17; arquivos de logo/anexos em diretorio persistente no MVP, acessado por uma abstracao de armazenamento substituivel.

**Testes**: Jest no backend com Supertest e banco PostgreSQL isolado para integracao; React Testing Library pode ser incorporado aos testes essenciais de interface.

**Plataforma alvo**: Aplicacao web responsiva em navegadores modernos; API executada em ambiente Node.js Linux ou conteiner equivalente.

**Tipo de projeto**: Aplicacao web full stack com SPA e API REST.

**Metas de desempenho**: Listagens filtradas e dashboard em ate 3 segundos em 95% das consultas no volume de aceite; download do PDF em ate 5 segundos para orcamento usual.

**Restricoes**: Valores monetarios somente em decimal; estoque e status criticos atualizados em transacao; dados pessoais e financeiros protegidos por perfil; interface em pt-BR.

**Escala inicial**: Empresa unica, ate 10.000 clientes, 20.000 orcamentos, 10.000 ordens, 5.000 produtos e dezenas de usuarios internos.

### Diagrama de Componentes

```text
Navegador
  -> frontend/ React SPA
       -> cliente HTTP tipado a partir de contrato OpenAPI
            -> backend/ Express API /api/v1
                 -> middlewares (auth, perfil, validacao, erros, logs)
                 -> controllers (HTTP apenas)
                 -> services (regras e transacoes)
                 -> repositories (consultas Prisma)
                 -> PostgreSQL
                 -> armazenamento de uploads
                 -> gerador PDF
```

### Separacao de Responsabilidades

| Camada | Responsabilidade | Nao deve conter |
|--------|------------------|-----------------|
| Routes | URL, middleware e controller associado | Regra de negocio ou consulta |
| Controllers | Entrada/saida HTTP e chamada de service | Calculo, autorizacao de dominio ou Prisma |
| Validators | Schemas Zod, coercao segura e mensagens | Persistencia |
| Services | Casos de uso, permissoes contextuais, calculos e transacoes | Detalhes de HTTP |
| Repositories | Consultas e comandos Prisma reutilizaveis | Decisoes de fluxo |
| Utils/providers | PDF, upload, token, dinheiro, numero de documento | Orquestracao de caso de uso |

### Constitution Check

O arquivo `.specify/memory/constitution.md` ainda contem somente placeholders e nao estabelece gates executaveis. Este plano aplica os gates derivados da especificacao e da solicitacao tecnica:

| Gate | Resultado antes do desenho | Resultado apos o desenho |
|------|----------------------------|---------------------------|
| Controllers sem regra de negocio e rotas sem acesso direto ao banco | PASS | PASS: camadas definidas e services transacionais |
| TypeScript, React + Vite, Express, Prisma, PostgreSQL, JWT e Jest preservados | PASS | PASS: todas as decisoes usam a stack exigida |
| Estoque sem baixa no orcamento e sem duplicidade na conclusao | PASS | PASS: transacao e idempotencia definidas |
| Valores financeiros com precisao decimal | PASS | PASS: `Decimal(14,2)` e calculo no backend |
| Permissoes protegidas no servidor | PASS | PASS: JWT mais RBAC por endpoint e caso de uso |

Nenhuma violacao exige justificativa de complexidade.

## 5. Estrutura de Pastas do Frontend

```text
frontend/
|-- public/
|-- src/
|   |-- app/
|   |   |-- router.tsx
|   |   |-- providers.tsx
|   |   `-- permissions.ts
|   |-- assets/
|   |-- components/
|   |   |-- layout/
|   |   |-- forms/
|   |   |-- tables/
|   |   |-- feedback/
|   |   `-- charts/
|   |-- features/
|   |   |-- auth/
|   |   |-- dashboard/
|   |   |-- clients/
|   |   |-- products/
|   |   |-- services/
|   |   |-- quotes/
|   |   |-- work-orders/
|   |   |-- payments/
|   |   |-- reports/
|   |   |-- settings/
|   |   `-- users/
|   |-- hooks/
|   |-- lib/
|   |   |-- api/
|   |   |-- formatters/
|   |   |-- masks/
|   |   `-- validation/
|   |-- store/
|   |-- styles/
|   `-- main.tsx
|-- tests/
|-- vite.config.ts
`-- package.json
```

Cada pasta em `features/` contem paginas, componentes de dominio, schemas de formulario e hooks de consulta. TanStack Query mantem estado vindo da API; Zustand guarda sessao em memoria e preferencias de interface, evitando duplicar dados persistidos.

## 6. Estrutura de Pastas do Backend

```text
backend/
|-- prisma/
|   |-- schema.prisma
|   |-- migrations/
|   `-- seed.ts
|-- storage/
|-- src/
|   |-- app.ts
|   |-- server.ts
|   |-- config/
|   |-- routes/
|   |-- controllers/
|   |-- services/
|   |-- repositories/
|   |-- middlewares/
|   |-- validators/
|   |-- utils/
|   |-- providers/
|   |   |-- auth/
|   |   |-- pdf/
|   |   `-- storage/
|   |-- types/
|   `-- jobs/
|-- tests/
|   |-- unit/
|   |-- integration/
|   |-- fixtures/
|   `-- helpers/
|-- uploads/
|-- jest.config.ts
|-- tsconfig.json
`-- package.json
```

Os services principais serao `AuthService`, `QuoteService`, `WorkOrderService`, `StockService`, `PaymentService`, `DashboardService` e `PdfService`. Repositories nao sao expostos as rotas. O contrato de desenho permanece em `specs/001-sistema-orcamentos/contracts/openapi.yaml`; durante a implementacao sera gerado ou sincronizado a partir da fonte normativa definida na Fase 0.

## 7. Modelagem do Banco de Dados com Prisma

O desenho detalhado esta em [data-model.md](./data-model.md). Os modelos minimos sao `User`, `Client`, `Product`, `StockMovement`, `Service`, `Quote`, `QuoteItem`, `WorkOrder`, `WorkOrderItem`, `Payment`, `CompanySettings` e `Attachment`.

Modelos auxiliares necessarios para consistencia:

| Modelo | Motivo |
|--------|--------|
| `RefreshToken` | Rotacao e revogacao de sessao sem guardar token puro |
| `DocumentSequence` | Numeracao unica e transacional de orcamentos e OS |
| `AuditLog` | Trilha de status, estoque, pagamentos e operacoes administrativas |

Decisoes de persistencia:

- Identificadores `String` UUID; `createdAt` e `updatedAt` em todas as entidades mutaveis.
- `deletedAt` em usuarios, clientes, produtos e servicos; documentos financeiros e operacionais sao cancelados/inativados, nunca apagados.
- Dinheiro em `Decimal @db.Decimal(14, 2)` e quantidade em `Decimal @db.Decimal(14, 3)` para admitir unidades fracionarias.
- `QuoteItem` e `WorkOrderItem` armazenam snapshots de descricao, preco e custo; edicao posterior do catalogo nao altera documentos.
- Uma relacao unica em `WorkOrder.quoteId` impede mais de uma OS para o mesmo orcamento.
- `StockMovement.workOrderItemId` unico na baixa automatica impede repeticao por item.

## 8. Principais Fluxos do Sistema

### Orcamento e PDF

1. Atendente seleciona cliente ativo e itens ativos.
2. Backend captura snapshots, calcula itens/descontos/taxas com decimal e cria `RASCUNHO`.
3. Ao enviar, status vira `ENVIADO`; um orcamento vencido e reconciliado para `EXPIRADO`.
4. PDF e produzido a partir do snapshot do orcamento e configuracao da empresa usada na emissao.
5. Usuario autorizado registra `APROVADO` ou `RECUSADO`; aprovacao nao movimenta estoque.

### OS e Estoque

1. Atendente/admin abre OS manual ou converte exatamente um orcamento aprovado.
2. Tecnico registra execucao, itens efetivamente utilizados e anexos.
3. `WorkOrderService.complete()` abre transacao serializavel, valida estado e saldo, cria movimentacoes, atualiza saldos, marca `CONCLUIDA` e grava auditoria.
4. Se estoque negativo estiver desabilitado, qualquer insuficiencia desfaz toda a conclusao; se habilitado por admin, o saldo negativo e registrado e alertado.
5. Uma OS concluida fica bloqueada para edicao livre; correcoes usam movimento compensatorio auditado.

### Pagamentos e Dashboard

1. Financeiro registra pagamento para orcamento ou OS e a situacao e derivada do total confirmado.
2. Receita considera pagamentos confirmados; custo/lucro usa itens efetivamente executados em OS concluida.
3. Dashboard agrega o periodo solicitado com escopo por perfil e mostra indicadores/listas/graficos.

## 9. Endpoints da API REST

Contrato completo inicial: [contracts/openapi.yaml](./contracts/openapi.yaml). Todos os endpoints, salvo login e refresh, exigem JWT; listagens recebem `page`, `pageSize`, `search`, filtros e ordenacao permitida.

| Recurso | Endpoints principais | Perfis |
|---------|----------------------|--------|
| Auth | `POST /auth/login`, `/auth/refresh`, `/auth/logout`, `GET /auth/me` | Autenticado apos login |
| Usuarios | `GET/POST /users`, `PATCH /users/{id}`, `PATCH /users/{id}/status` | ADMIN |
| Empresa | `GET/PATCH /company-settings`, `POST /company-settings/logo` | Leitura autorizada; escrita ADMIN |
| Clientes | `GET/POST /clients`, `GET/PATCH/DELETE /clients/{id}`, `GET /clients/{id}/history` | ADMIN, ATENDENTE; leituras limitadas aos demais |
| Servicos | `GET/POST /services`, `PATCH/DELETE /services/{id}` | Escrita ADMIN; leitura operacional |
| Produtos | `GET/POST /products`, `PATCH/DELETE /products/{id}`, `GET /products/low-stock` | Escrita/movimento ADMIN; leitura operacional/financeira |
| Estoque | `GET /stock-movements`, `POST /products/{id}/stock-movements` | ADMIN |
| Orcamentos | `GET/POST /quotes`, `GET/PATCH /quotes/{id}`, `PATCH /quotes/{id}/status`, `GET /quotes/{id}/pdf` | ADMIN, ATENDENTE; consulta FINANCEIRO |
| OS | `GET/POST /work-orders`, `POST /quotes/{id}/work-order`, `GET/PATCH /work-orders/{id}`, `POST /work-orders/{id}/complete` | Conforme papel operacional |
| Anexos | `POST/GET /work-orders/{id}/attachments`, `DELETE /attachments/{id}` | ADMIN/TECNICO autorizados |
| Pagamentos | `GET/POST /payments`, `PATCH /payments/{id}` | ADMIN, FINANCEIRO |
| Dashboard | `GET /dashboard/summary`, `/dashboard/revenue`, `/dashboard/quote-status`, `/dashboard/top-products` | Resultado filtrado pelo perfil |
| Relatorios | `GET /reports/quotes`, `/work-orders`, `/payments`, `/stock` | ADMIN/FINANCEIRO conforme conteudo |

## 10. Regras de Negocio Detalhadas

- Criacao, envio e aprovacao de orcamento nao alteram `Product.stockQuantity`.
- Somente uma OS pode referenciar um orcamento aprovado; OS manual possui `quoteId` nulo.
- Mudancas de status obedecem transicoes definidas em [data-model.md](./data-model.md).
- Conclusao de OS e idempotente: se ja concluida, responde conflito e nao cria movimentos.
- Baixa automatica tem origem `WORK_ORDER`, referencia item da OS e ocorre na mesma transacao do status final.
- Saldo negativo e proibido por padrao; ativacao de `allowNegativeStock` exige ADMIN e gera auditoria.
- Item de documento captura descricao/precos/custos no momento apropriado; catalogos so servem como referencia.
- Calculo financeiro utiliza decimal no servidor; valores enviados pelo navegador nunca sao a fonte final do total.
- Pagamento cancelado nao compoe receita; pagamento parcial atualiza situacao sem encerrar saldo.
- Exclusao logica retira registros de novas selecoes, preservando historicos e relatorios.
- Acesso financeiro e filtrado no backend, nao apenas ocultado pela interface.

## 11. Estrategia de Autenticacao e Autorizacao

- `User.passwordHash` guarda hash `bcrypt` com custo inicial 12, calibrado em ambiente de execucao e nunca inferior a 10; senha aceita no maximo 72 bytes devido ao limite do algoritmo exigido.
- Login devolve access token JWT assinado, validade de 15 minutos, com `sub`, `role`, `iat` e `exp`.
- Refresh token e opaco, aleatorio, rotativo e armazenado apenas como hash em `RefreshToken`; segue em cookie `HttpOnly`, `Secure` em producao e `SameSite=Strict`.
- Frontend mantem access token apenas em memoria e tenta uma renovacao controlada ao receber expiracao; logout revoga a sessao de refresh.
- `authenticate` verifica token e usuario ativo; `authorize(...roles)` protege rota; o service valida propriedade contextual, por exemplo tecnico atuando na OS permitida.
- Eventos de login falho, refresh revogado, alteracao de perfil e bloqueio de acesso entram em log/auditoria sem segredos.

## 12. Estrategia de Geracao de PDF

- Geracao ocorre no backend em `providers/pdf/quote-pdf.provider.ts`, usando PDFKit e dados prontos entregues por `QuotePdfService`.
- O service carrega snapshot do orcamento, cliente registrado no documento e configuracao empresarial; nao recompõe precos pelo catalogo atual.
- Layout A4 inclui cabecalho com logo/dados, identificacao e validade, tabelas separadas de servicos e produtos, resumo financeiro, condicoes, aceite e rodape.
- Imagens aceitas para logo sao validadas por tipo/tamanho; ausencia de logo gera cabecalho textual sem interromper o documento.
- Endpoint responde arquivo para download com nome previsivel, por exemplo `orcamento-ORC-2026-00001.pdf`, e registra erro sem corromper o orcamento.

## 13. Estrategia de Testes com Jest

| Nivel | Escopo | Casos obrigatorios |
|-------|--------|--------------------|
| Unitario | Services e utils com repositories mockados | calculo decimal do orcamento; transicoes; autorizacao; status de pagamento; alertas |
| Integracao | Rotas Express + Prisma + PostgreSQL de teste + Supertest | login/refresh; CRUD essencial; criacao/aprovacao; conversao; OS manual; upload; PDF |
| Transacional | Services com banco real | conclusao simultanea da OS; estoque insuficiente; idempotencia; permissao de negativo |
| Contrato | Respostas contra OpenAPI | envelopes, erros, paginacao e enums |

Gates por fase: `lint`, `typecheck`, `jest --runInBand` para integracao com banco e migracoes limpas. Testes devem provar que orcamento nao movimenta estoque e que duas tentativas concorrentes de concluir uma OS nao duplicam baixa.

## 14. Estrategia de Tratamento de Erros

- `AppError` categorizado (`VALIDATION_ERROR`, `UNAUTHORIZED`, `FORBIDDEN`, `NOT_FOUND`, `CONFLICT`, `INSUFFICIENT_STOCK`, `INTERNAL_ERROR`).
- Middleware final Express traduz falhas em status HTTP, `code`, mensagem pt-BR segura, detalhes de campo quando aplicavel e `requestId`.
- Erros Prisma esperados (unicos, registro ausente, conflito serializavel) sao mapeados no service/repository; falhas internas nao expõem stack ao cliente.
- Logs estruturados incluem `requestId`, usuario, rota, duracao e erro; senha, JWT, refresh token e documentos pessoais nao sao logados.

Formato padrao:

```json
{
  "success": false,
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "Estoque insuficiente para concluir a ordem de servico.",
    "details": []
  },
  "requestId": "uuid"
}
```

## 15. Estrategia de Validacao de Dados

- Zod no backend e frontend; schemas do backend sao fonte normativa e alimentam o contrato OpenAPI.
- CPF/CNPJ e telefones sao normalizados antes da persistencia; unicidade ignora mascara.
- Datas chegam em ISO 8601, exibidas em pt-BR no frontend; datas do negocio usam fuso configurado para a empresa.
- Dinheiro e quantidades chegam como strings decimais validas e sao convertidos para `Prisma.Decimal` apenas no backend.
- Paginas e filtros possuem limites (`pageSize` maximo 100); upload valida extensao, MIME e tamanho antes de gravar.

## 16. Estrategia de Seguranca

- Helmet, CORS por origem configurada, limite de corpo, rate limit mais restrito em login/refresh e headers de correlacao.
- Segredos (`DATABASE_URL`, chaves JWT, cookie e upload) somente em variaveis de ambiente; `.env.example` sem valores sensiveis.
- JWT assinado com chave rotacionavel e audiencia/emissor verificados; refresh rotativo detecta reutilizacao e revoga a familia.
- Senhas com bcrypt conforme requisito, auditoria de perfis, minimo privilegio e mensagens que nao enumeram usuarios no login.
- Arquivos ficam fora da arvore publica, nomeados por identificador gerado; download exige autorizacao e resposta com tipo seguro.
- Dependencias auditadas no pipeline; backup e conexao TLS do PostgreSQL definidos para producao.

## 17. Plano de Implementacao por Etapas

| Fase | Objetivo | Arquivos/diretorios afetados | Dependencias | Testes necessarios | Criterio de conclusao |
|------|----------|-------------------------------|--------------|-------------------|-----------------------|
| 0. Fundacao | Criar workspaces, TypeScript, qualidade, env e PostgreSQL local | `package.json`, `frontend/`, `backend/`, `docker-compose.yml`, `.env.example` | Node LTS, PostgreSQL | build vazio, lint e typecheck | apps inicializam e API responde health |
| 1. Persistencia | Implementar schema Prisma, migracao inicial, seed admin e repositories base | `backend/prisma/`, `backend/src/repositories/` | Fase 0, data-model | migracao em BD limpo, indices/constraints | modelos e seed reproduziveis |
| 2. Auth/RBAC | Implementar login JWT, refresh rotativo, usuarios e protecao de rotas | `backend/src/{routes,controllers,services,middlewares,providers}/auth*`, `frontend/src/features/auth/` | Fase 1 | unitarios auth; integracao login/refresh/perfis | quatro perfis protegidos no servidor e UI |
| 3. Cadastros | Clientes, servicos, produtos, empresa e uploads de logo | features correspondentes em ambas apps; storage provider | Fases 1-2 | CRUD, soft delete, filtros, upload | cadastros e configuracao operacionais |
| 4. Estoque | Movimentacoes manuais, saldo e estoque baixo | `StockService`, repository, paginas de produtos/estoque | Fase 3 | entrada/saida/ajuste, saldo insuficiente | historico e alertas coerentes |
| 5. Orcamentos | Criacao, calculos, status, filtros e historico do cliente | `QuoteService`, validators, UI de orcamento | Fases 3-4 | calculos Decimal, status, nao movimentar estoque | orcamento pronto para envio/aprovacao |
| 6. PDF | Gerar e baixar proposta profissional | provider PDF, rota download, template e logo | Fase 5 | conteudo/snapshot, arquivo valido, erro de logo | PDF confere com dados emitidos |
| 7. OS | OS manual/conversao, tecnico, anexos e ciclo operacional | `WorkOrderService`, attachments, UI OS | Fases 3-6 | conversao unica, status, permissao tecnico | OS rastreavel sem consumo prematuro |
| 8. Conclusao/estoque | Aplicar baixa atomica, configuracao negativa e bloqueio pos-conclusao | services/repositories de OS e estoque | Fases 4 e 7 | concorrencia, idempotencia, insuficiencia | estoque jamais duplica baixa |
| 9. Financeiro | Pagamentos, saldo e relatorios basicos | `PaymentService`, paginas financeiro/relatorios | Fases 5 e 8 | parcial/pago/cancelado, RBAC | receita/custo/lucro consultaveis |
| 10. Dashboard | Cards, graficos, recentes e filtros por papel | `DashboardService`, queries e pagina dashboard | Fases 4-9 | agregacoes e visibilidade por perfil | indicadores cumprem aceite |
| 11. Hardening | Acessibilidade, responsividade, seguranca, documentacao e aceite | ambas apps, contratos, README | Todas | suite completa, carga basica, aceite manual | MVP implantavel e documentado |

## 18. Criterios de Aceite

- Atendente cria cliente e orcamento de cinco itens, gera PDF e registra aprovacao em ate 5 minutos.
- A aprovacao e a criacao de orcamento nao criam movimentacao de estoque.
- Uma OS pode nascer manualmente ou de um orcamento aprovado; um orcamento nao gera duas OS.
- Conclusao de OS registra exatamente uma baixa por peca, inclusive sob repeticao/concorrrencia; saldo insuficiente bloqueia por padrao.
- Usuario ADMIN pode habilitar estoque negativo com auditoria; os demais nao podem mudar essa opcao.
- Valores e lucro usam decimal e conferem com itens, descontos, custo e pagamentos confirmados.
- PDFs preservam os dados emitidos mesmo apos alteracao de cadastros.
- Perfis nao acessam acoes/dados proibidos nem por URL direta.
- Dashboard e listagens cumprem os indicadores previstos e metas de consulta da especificacao.
- API, migracoes, instrucoes e testes Jest permitem executar o MVP em ambiente novo.

## 19. Riscos Tecnicos e Decisoes Recomendadas

| Risco | Impacto | Decisao/mitigacao |
|-------|---------|-------------------|
| Concorrencia na conclusao da OS | Estoque duplicado ou negativo indevido | Transacao serializavel, movimento unico por item e teste concorrente |
| Calculo monetario em ponto flutuante | Totais e lucros incorretos | Decimal PostgreSQL/Prisma e calculo centralizado no backend |
| JWT vazado ou refresh reutilizado | Acesso nao autorizado | Access curto, refresh hash rotativo em cookie e revogacao |
| Alteracao de catalogo quebra PDF/historico | Documento inconsistente | Snapshots em itens e configuracao usada na emissao |
| Upload local nao escala horizontalmente | Arquivo indisponivel em replicas | Interface de storage desde o MVP; migrar para objeto no futuro |
| Dashboard com agregacoes lentas | Experiencia ruim com crescimento | Indices propostos, filtros por periodo e medicao antes de materializacao |
| Constituicao do projeto nao ratificada | Gates organizacionais indefinidos | Formalizar constituicao antes da implementacao ou manter gates deste plano |

### Validacao da Estrutura Proposta

- Nao ha regra de negocio em controllers: calculos, permissoes contextuais, status e transacoes pertencem a services.
- Nao ha Prisma em routes: repositories encapsulam acesso e favorecem testes/mudanca de consulta.
- O contrato REST e a geracao de tipos evitam duplicar DTOs manualmente entre frontend e backend.
- PDF, autenticacao e armazenamento sao providers isolados, substituiveis sem reescrever dominio.
- Modulos seguem recursos de negocio e permitem implementar/testar fases pequenas antes de montar dashboard.

## Complexity Tracking

Nenhuma violacao de gate foi identificada; tabela de excecoes nao se aplica.
