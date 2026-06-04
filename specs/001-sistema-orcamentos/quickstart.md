# Quickstart Planejado: Sistema de Orcamentos e Ordens de Servico

Este guia descreve como o projeto devera ser preparado e verificado durante a implementacao. Nesta fase de planejamento ainda nao existem aplicacoes executaveis.

## 1. Pre-requisitos de Desenvolvimento

- Node.js 24 LTS e npm compativel.
- PostgreSQL 17 local ou em conteiner.
- Variaveis de ambiente distintas para desenvolvimento e testes.
- Diretorio persistente gravavel para uploads locais no MVP.

## 2. Organizacao Esperada

```text
sistema_orcamento/
|-- backend/
|-- frontend/
|-- specs/001-sistema-orcamentos/
|   |-- contracts/openapi.yaml
|   |-- data-model.md
|   `-- plan.md
|-- docker-compose.yml
|-- .env.example
`-- package.json
```

O arquivo [contracts/openapi.yaml](./contracts/openapi.yaml) e o contrato de desenho. Na implementacao, ele deve ser validado e usado para gerar tipos do cliente web ou ser sincronizado a partir dos schemas Zod do backend, escolhendo uma unica fonte normativa.

## 3. Variaveis de Ambiente Planejadas

| Variavel | Uso |
|----------|-----|
| `NODE_ENV` | `development`, `test` ou `production` |
| `PORT` | porta da API |
| `DATABASE_URL` | conexao PostgreSQL de desenvolvimento |
| `TEST_DATABASE_URL` | banco isolado para integracao Jest |
| `JWT_PRIVATE_KEY` / `JWT_PUBLIC_KEY` | assinatura/verificacao do access token |
| `JWT_ISSUER` / `JWT_AUDIENCE` | restricao de token |
| `ACCESS_TOKEN_TTL` | duracao curta, inicialmente `15m` |
| `REFRESH_TOKEN_TTL` | duracao da sessao renovavel |
| `COOKIE_SECRET` | protecao/configuracao de cookie |
| `CORS_ORIGIN` | origem permitida do frontend |
| `UPLOAD_DIR` | volume de logo e anexos |
| `LOG_LEVEL` | nivel de log estruturado |

Nenhuma chave real deve ser versionada.

## 4. Sequencia de Setup da Implementacao

1. Criar workspace raiz e projetos `frontend` React/Vite TypeScript e `backend` Node/Express TypeScript.
2. Configurar PostgreSQL local e dois bancos separados: desenvolvimento e testes.
3. Implementar `backend/prisma/schema.prisma` conforme [data-model.md](./data-model.md), gerar migracao e executar seed de administrador.
4. Configurar API, health check, middleware de erros, seguranca, logs e validacao.
5. Implementar fases de [plan.md](./plan.md) na ordem proposta, mantendo o contrato atualizado.
6. Criar `.env` local a partir do exemplo futuro e iniciar frontend/backend separadamente ou pelo workspace.

## 5. Comandos Esperados Apos a Fundacao

Os nomes finais serao definidos na Fase 0, mas o projeto deve expor uma experiencia equivalente:

```bash
npm install
npm run db:up
npm run prisma:migrate --workspace backend
npm run prisma:seed --workspace backend
npm run dev
npm run lint
npm run typecheck
npm run test --workspace backend
npm run build
```

## 6. Dados Minimos para Demonstracao

- Uma empresa configurada com logo e Pix.
- Um usuario de cada papel.
- Dois clientes, tres servicos e cinco produtos, incluindo um proximo do estoque minimo.
- Um orcamento rascunho e um aprovado para conversao.
- Uma OS manual e uma OS originada de orcamento.
- Pagamentos pendente, parcial e pago para exercitar indicadores.

## 7. Roteiro de Verificacao do MVP

| Passo | Acao | Resultado esperado |
|-------|------|--------------------|
| 1 | Entrar com cada papel | Menu e endpoints respeitam permissao |
| 2 | Cadastrar cliente/produtos/servicos | Busca, filtros e inativacao funcionam |
| 3 | Criar orcamento com descontos e baixar PDF | Total correto; PDF completo; estoque intacto |
| 4 | Aprovar e converter para OS | Uma unica OS vinculada; estoque intacto |
| 5 | Tentar concluir com estoque insuficiente | Bloqueio por padrao e nenhum movimento parcial |
| 6 | Registrar entrada e concluir OS | Movimentos unicos e saldo atualizado |
| 7 | Repetir conclusao | Conflito sem segunda baixa |
| 8 | Registrar pagamentos | Situacao e receita atualizadas |
| 9 | Consultar dashboard | Cards/graficos refletem os dados por papel |

## 8. Testes e Gates de Entrega

- Executar migracoes em banco vazio e seed sem intervencao manual.
- Rodar Jest unitario e integracao, incluindo conclusao concorrente de OS.
- Validar o contrato OpenAPI e respostas padronizadas.
- Gerar PDF de exemplo e conferir conteudo/formatacao.
- Executar teste responsivo manual das tarefas essenciais.
- Verificar logs, rate limit, CORS, upload e ausencia de segredos no repositorio.

## 9. Limites da Primeira Execucao

PDF sera baixado para envio externo, pagamentos serao registrados manualmente e anexos usarao armazenamento local abstrato. Integracoes externas, recuperacao de senha e multiempresa permanecem fora do roteiro do MVP.
