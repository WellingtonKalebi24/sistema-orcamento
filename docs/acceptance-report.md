# Relatorio de Aceite do MVP

## Gates Executados

- Formatacao, lint, typecheck, Jest backend, Vitest frontend, build, OpenAPI e audit.
- Testes cobrem autenticacao, orcamentos, OS, estoque, pagamentos, dashboard e contratos principais.

## Roteiro Manual

1. Entrar com `admin@sistema.local` / `Admin@12345`.
2. Conferir usuarios dos quatro perfis.
3. Editar configuracoes da empresa e enviar logo.
4. Cadastrar cliente, servico e produto.
5. Criar orcamento, aprovar e gerar PDF.
6. Converter para OS, anexar arquivo e concluir.
7. Registrar pagamento e consultar dashboard/relatorios.

## Resultado Esperado

Perfis veem apenas menus autorizados, estoque nao baixa no orcamento, OS concluida baixa uma vez e dashboard reflete os dados.
