# Pesquisa e Decisoes Tecnicas: Sistema de Orcamentos e Ordens de Servico

**Data**: 2026-05-23  
**Finalidade**: Resolver escolhas tecnicas do plano antes do detalhamento de dados e contratos.

## Decisao 1 - Runtime e organizacao do repositorio

**Decisao**: Usar Node.js 24 LTS, TypeScript em ambas as aplicacoes e um workspace com `frontend/` e `backend/`.

**Racional**: Em 2026-05-23, Node.js 24 e uma linha LTS ativa e atende ao requisito minimo atual do Vite. Duas aplicacoes separadas preservam limites de deploy, enquanto um workspace unifica scripts, lint e contratos.

**Alternativas consideradas**:

- Node Current: rejeitado por priorizar novidade em vez de estabilidade do MVP.
- Repositorios separados: rejeitado inicialmente por aumentar coordenacao de contrato e setup.
- Framework full stack: rejeitado porque a stack Express + Vite foi explicitamente exigida.

**Referencias**: [Node.js releases](https://nodejs.org/en/blog/all), [Vite Getting Started](https://vite.dev/guide/), [React TypeScript](https://react.dev/learn/typescript).

## Decisao 2 - API e separacao das responsabilidades

**Decisao**: API REST Express 5 em `/api/v1`, documentada com OpenAPI; cadeia `routes -> middlewares/validators -> controllers -> services -> repositories -> Prisma`.

**Racional**: A fronteira REST atende SPA, PDF e futuros consumidores. Express e baseado em middleware e oferece middleware final de erro; separar services impede que HTTP e persistencia definam as regras de estoque/financeiro.

**Alternativas consideradas**:

- GraphQL: rejeitado para o MVP porque filtros CRUD e relatorios simples nao justificam camada extra.
- Controllers com Prisma direto: rejeitado por acoplar regras transacionais e dificultar testes.
- DTOs duplicados manualmente: rejeitado; o frontend devera consumir tipos gerados do OpenAPI.

**Referencias**: [Express middleware](https://expressjs.com/en/5x/guide/using-middleware).

## Decisao 3 - Persistencia e calculos monetarios

**Decisao**: PostgreSQL com Prisma ORM; moeda armazenada como `Decimal @db.Decimal(14,2)` e quantidades como `Decimal @db.Decimal(14,3)`.

**Racional**: Prisma oferece tipagem TypeScript, migracoes e suporte nativo a PostgreSQL e campos decimais. Valores BRL nao devem utilizar `number` binario em calculos finais.

**Alternativas consideradas**:

- Valores em centavos inteiros: viavel para dinheiro, mas menos uniforme quando quantidade fracionaria multiplica preco.
- `Float`: rejeitado por erro de arredondamento.
- Salvar somente totais: rejeitado porque auditoria exige composicao historica.

**Referencias**: [Prisma ORM](https://www.prisma.io/docs/v6/orm), [Prisma schema reference](https://docs.prisma.io/docs/orm/reference/prisma-schema-reference), [PostgreSQL connector](https://docs.prisma.io/docs/v6/orm/overview/databases/postgresql).

## Decisao 4 - Consumo atomico de estoque

**Decisao**: Concluir OS em transacao Prisma interativa com isolamento `Serializable`, validacao de saldo, atualizacao de produto, criacao de `StockMovement` e mudanca final de status na mesma unidade atomica.

**Racional**: Conclusoes concorrentes sao operacoes de ler-modificar-gravar. PostgreSQL utiliza isolamento inferior por padrao; a conclusao precisa detectar conflito e repetir de forma limitada ou informar nova tentativa. Uma restricao unica por item da OS torna a baixa idempotente.

**Alternativas consideradas**:

- Baixa na aprovacao: rejeitada pela regra de negocio e por reservar itens que podem nao ser usados.
- Baixa sem transacao: rejeitada por permitir saldo incorreto.
- Reserva de estoque: adiada; pode ser adicionada quando houver agenda/compromisso de pecas.

**Referencias**: [Prisma transactions](https://www.prisma.io/docs/orm/prisma-client/queries/transactions).

## Decisao 5 - JWT, refresh e senha

**Decisao**: Access token JWT de curta duracao (15 minutos) em memoria do frontend; refresh token opaco rotativo em cookie `HttpOnly` e guardado como hash revogavel; senha com `bcrypt` custo inicial 12 e limite de 72 bytes.

**Racional**: JWT satisfaz autenticacao stateless das chamadas usuais. Refresh com estado possibilita logout/revogacao e reduz exposicao. O usuario exigiu bcrypt; OWASP informa que, quando empregado, deve usar fator de trabalho no minimo 10 e respeitar o limite de entrada do algoritmo.

**Alternativas consideradas**:

- JWT persistido em `localStorage`: rejeitado por ampliar impacto de XSS.
- JWT longo sem refresh: rejeitado por prolongar comprometimento e impedir revogacao simples.
- Argon2id: tecnicamente preferivel para um sistema novo segundo OWASP, mas nao usado nesta feature porque bcrypt foi requisito expresso; fica como decisao revisavel.

**Referencias**: [OWASP Password Storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html), [OWASP Authentication](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html).

## Decisao 6 - Estado e formularios no frontend

**Decisao**: React Router para navegacao; TanStack Query para cache de servidor; Zustand somente para sessao/estado local global; React Hook Form com Zod para formularios; Recharts para dashboard.

**Racional**: Dados de negocio permanecem na API e sao invalidados por recurso, enquanto a store global nao vira copia do banco. A mesma semantica de validacao reduz mensagens inconsistentes.

**Alternativas consideradas**:

- Context API para todos os dados: rejeitado pela manutencao de cache/filtros e atualizacoes.
- Redux Toolkit: valido, mas maior superficie para o MVP sem necessidade de fluxos locais complexos.

## Decisao 7 - Geracao de PDF

**Decisao**: PDFKit no backend com composicao dedicada e streaming do arquivo para download.

**Racional**: O PDF depende de dados protegidos e snapshots; gerar no servidor assegura permissao, layout unico e historico. PDFKit evita executar navegador headless para uma proposta tabular de complexidade moderada.

**Alternativas consideradas**:

- Geracao no frontend: rejeitada por seguranca e consistencia documental.
- HTML mais Chromium: reservada para caso o layout futuro exija fidelidade CSS complexa; introduz dependencia operacional maior no MVP.

## Decisao 8 - Upload de logo e anexos

**Decisao**: Criar interface `StorageProvider`; implementacao MVP em volume persistente local com metadados na tabela `Attachment`, autorizacao no download e limites de MIME/tamanho.

**Racional**: Implementa o requisito sem comprometer a arquitetura; migracao futura para armazenamento de objetos troca provider, nao dominio.

**Alternativas consideradas**:

- Binario no PostgreSQL: rejeitado por aumentar banco e backup para arquivos comuns.
- Servico de objetos desde o primeiro dia: valido em producao distribuida, mas nao necessario ao primeiro fluxo local/deploy unico.

## Decisao 9 - Testes

**Decisao**: Jest e Supertest no backend, com unidades mockando repositories e integracao contra PostgreSQL real isolado; TypeScript compilado no fluxo de testes com `ts-jest` ou transform equivalente aprovado na implementacao.

**Racional**: Regras criticas dependem de semantica real de transacao e restricoes do PostgreSQL; SQLite em memoria nao demonstraria concorrencia ou tipos da mesma forma.

**Alternativas consideradas**:

- Apenas unitarios: rejeitado por nao provar migracoes, middleware ou transacoes.
- Banco em memoria: rejeitado pela divergencia das garantias de PostgreSQL.

**Referencias**: [Jest Getting Started](https://jestjs.io/docs/getting-started).

## Decisao 10 - Itens fora do MVP

**Decisao**: Nao incluir envio automatico, portal externo, recuperacao de senha, fiscal, conciliacao ou multiempresa na primeira implementacao.

**Racional**: Esses itens introduzem integracoes, compliance ou isolamento de tenant sem serem necessarios para comprovar o ciclo comercial-operacional-financeiro solicitado.

**Alternativas consideradas**: Implementar tudo na primeira entrega foi rejeitado por ampliar risco antes que o fluxo central esteja testado.

## Resultado da Pesquisa

Nao restam decisoes em aberto para o planejamento. As escolhas tecnicas preservam a stack obrigatoria, isolam regras sensiveis em services e permitem evolucao de armazenamento, autenticacao e integracoes sem reestruturar o dominio.
