# Checklist de Prontidao de Implementacao: Sistema de Orcamentos e Ordens de Servico

**Objetivo**: Validar se especificacao, plano, modelo, contrato e tarefas estao claros o suficiente para continuar a implementacao a partir da fase fundacional.
**Criado em**: 2026-06-04
**Funcionalidade**: [spec.md](../spec.md)

**Nota**: Esta checklist foi gerada pelo comando `/speckit-checklist` com foco em prontidao de implementacao. Os itens avaliam qualidade, rastreabilidade e ausencia de ambiguidades nos artefatos, nao o comportamento do codigo ja escrito.

## Escopo e Rastreabilidade

- [ ] CHK001 As tarefas T013-T032 estao rastreadas para os requisitos de autenticacao, seguranca, banco, erros, upload, contrato e layout protegido? [Traceability, Tasks Phase 2, Spec FR-001..FR-006, FR-040..FR-044]
- [ ] CHK002 A fronteira entre MVP e escopo futuro esta consistente entre especificacao, plano e quickstart antes de iniciar novas telas ou endpoints? [Consistency, Plan Sec. 2-3, Quickstart Sec. 9]
- [ ] CHK003 Cada historia de usuario possui um incremento independente com checkpoint e criterios de conclusao suficientes para demonstracao parcial? [Completeness, Spec User Stories, Tasks Phases 3-7]
- [ ] CHK004 As dependencias entre Setup, Foundational e historias deixam claro que nenhuma historia deve comecar antes de concluir T013-T032? [Clarity, Tasks Phase 2, Tasks Dependencies]
- [ ] CHK005 Os criterios de aceite do plano cobrem os resultados mensuraveis da especificacao sem criar metas conflitantes? [Consistency, Spec Success Criteria, Plan Sec. 18]

## Arquitetura e Separacao de Responsabilidades

- [ ] CHK006 A separacao entre routes, controllers, validators, services, repositories e providers esta definida de forma suficiente para impedir regra de negocio em controllers e Prisma direto em rotas? [Clarity, Plan Sec. 4]
- [ ] CHK007 As tarefas fundacionais atribuem arquivos coerentes a cada camada sem duplicar a mesma responsabilidade em modulos diferentes? [Maintainability, Tasks T016-T027, Plan Sec. 4]
- [ ] CHK008 Os services estao definidos como local das regras de dominio, permissoes contextuais, calculos e transacoes criticas? [Clarity, Plan Sec. 4, Plan Sec. 10]
- [ ] CHK009 Os repositories estao limitados a consultas e comandos Prisma reutilizaveis, sem decisoes de fluxo de negocio? [Clarity, Plan Sec. 4]
- [ ] CHK010 A abstracao de storage local para logo/anexos possui requisitos suficientes para futura troca por armazenamento externo sem reescrever services? [Extensibility, Plan Sec. 4, Plan Sec. 12, Tasks T021]

## Dados, Transacoes e Precisao

- [ ] CHK011 O modelo Prisma planejado cobre todos os modelos minimos exigidos, seus enums, indices, relacionamentos e campos de auditoria/tempo? [Coverage, Plan Sec. 7, Data Model Sec. 1-4]
- [ ] CHK012 As restricoes de integridade para vinculos exclusivos, unicidades documentais e protecoes historicas estao especificadas antes da migracao inicial? [Completeness, Tasks T013-T014, Data Model Sec. 6-8]
- [ ] CHK013 As fronteiras transacionais de criacao de orcamento, envio, conversao para OS, conclusao de OS e pagamentos estao descritas com efeitos atomicos e rollback esperado? [Clarity, Data Model Sec. 6, Plan Sec. 10]
- [ ] CHK014 Os requisitos de dinheiro, quantidades e calculo de lucro usam decimal de forma consistente em orcamentos, OS, pagamentos e estoque? [Consistency, Spec FR-016..FR-017, FR-034..FR-036, Plan Technical Context]
- [ ] CHK015 A regra de que orcamento nao movimenta estoque esta registrada de modo inequivo em especificacao, plano, modelo e tarefas? [Traceability, Spec FR-030, Plan Sec. 10, Data Model Sec. 6, Tasks T034/T042]
- [ ] CHK016 A baixa unica de estoque na conclusao da OS possui requisitos claros para idempotencia, concorrencia, saldo insuficiente e permissao administrativa de saldo negativo? [Clarity, Spec FR-030..FR-031, Plan Sec. 10, Data Model Sec. 6, Tasks T055/T059]
- [ ] CHK017 Soft delete, inativacao e preservacao historica estao definidos de maneira uniforme para clientes, produtos, servicos, usuarios e documentos emitidos? [Consistency, Spec FR-043, Data Model Sec. 7]

## Autenticacao, Autorizacao e Seguranca

- [ ] CHK018 A estrategia JWT/refresh define validade, armazenamento, rotacao, revogacao e claims necessarias para testes e implementacao sem ambiguidade? [Clarity, Plan Sec. 11, Tasks T022-T026]
- [ ] CHK019 A matriz de permissoes por perfil esta rastreavel para acoes de API, telas protegidas e regras contextuais no service? [Traceability, Spec Permissions Summary, Plan Sec. 9, Plan Sec. 11]
- [ ] CHK020 Os requisitos de protecao de dados sensiveis, logs sem segredos, Helmet, CORS, rate limit e variaveis de ambiente estao especificados com padroes mensuraveis? [Completeness, Plan Sec. 14, Plan Sec. 16, Tasks T018]
- [ ] CHK021 As politicas de upload de logo/anexos definem extensoes, MIME, tamanho, armazenamento fora da arvore publica e autorizacao de download? [Gap, Plan Sec. 12, Plan Sec. 15-16, Tasks T021/T060]
- [ ] CHK022 A recuperacao de senha e outras funcoes fora do MVP estao explicitamente separadas para evitar implementacao acidental no ciclo atual? [Scope, Plan Sec. 3, Spec Assumptions]

## Contrato, Validacao e Erros

- [ ] CHK023 O contrato OpenAPI cobre os endpoints MVP, envelopes de sucesso/erro, paginacao, filtros, enums e papeis de acesso esperados? [Coverage, Plan Sec. 9, Tasks T009/T101]
- [ ] CHK024 A fonte normativa dos schemas Zod e a sincronizacao com OpenAPI e frontend estao descritas sem conflito entre plano e tarefas? [Consistency, Plan Sec. 15, Tasks T019/T028/T101]
- [ ] CHK025 Os erros esperados possuem codigos, status HTTP, mensagens pt-BR e `requestId` suficientes para frontend, logs e suporte? [Clarity, Plan Sec. 14, Spec FR-044, Tasks T017]
- [ ] CHK026 As regras de validacao para CPF/CNPJ, telefone, datas, moeda, descontos, totais negativos e page size estao completas antes dos validadores compartilhados? [Completeness, Spec FR-009, FR-017, Plan Sec. 15, Tasks T019]

## PDF, Dashboard e Experiencia

- [ ] CHK027 Os requisitos do PDF definem snapshots historicos, ausencia de logo, falha de geracao, nome do arquivo, conteudo minimo e autorizacao de download? [Coverage, Spec FR-020..FR-021, Plan Sec. 12, Tasks T044-T045]
- [ ] CHK028 Os indicadores do dashboard possuem fonte de dados, periodo, regra de permissao e criterio de calculo suficientes para evitar numeros divergentes? [Gap, Spec FR-037..FR-039, Plan Sec. 8-9]
- [ ] CHK029 Os requisitos de interface responsiva, menu lateral, tabelas, filtros e mensagens de erro estao conectados as tarefas frontend correspondentes? [Traceability, Spec FR-040..FR-044, Tasks T029-T030, T046-T051]
- [ ] CHK030 O quickstart define pre-requisitos, variaveis, seed demonstrativo e gates de entrega suficientes para uma revisao local reproduzivel do MVP? [Completeness, Quickstart Sec. 1-8, Tasks T011/T032/T109]

## Notas

- Marque itens como concluidos com `[x]` apos revisar os artefatos correspondentes.
- Registre achados ou ajustes diretamente nos itens para manter rastreabilidade da revisao.
- Esta checklist deve ser usada antes de iniciar ou revisar as tarefas fundacionais T013-T032 e novamente antes da primeira historia de usuario.
