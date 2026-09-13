# Historico por cliente e equipamento

- Acesse Clientes > Historico / editar ou Relatorios > Relatorio por cliente.
- O historico inclui todas as OS e orcamentos do cliente, equipamentos, problemas relatados, execucao e pecas utilizadas.
- Use Imprimir / salvar PDF para imprimir o filtro atual pelo navegador.
- Cada OS identifica um equipamento, com nome, marca, modelo e numero de serie ou codigo interno unico dentro do cliente.
- Na nova OS, selecione um equipamento anterior ou preencha os campos. Na OS gerada de orcamento, preencha e salve o equipamento antes de concluir.
- Identificadores sao comparados sem espacos nas extremidades e sem diferenciar maiusculas/minusculas. Aparelhos distintos precisam de identificadores distintos, mesmo quando possuem a mesma marca/modelo.
- Retornos contam OS nao canceladas. Manutencoes realizadas contam apenas OS concluidas. Retorno nao comprova reincidencia do defeito ou garantia.
- Registros antigos sem identificacao permanecem no historico, sem inferencia automatica de identidade. OS concluidas continuam protegidas contra edicao.

## Atualizacao na VPS

A migracao `20260914000100_work_order_equipment` adiciona quatro colunas opcionais; nao remove tabelas, registros ou volumes. Faca backup antes de aplicar e mantenha o arquivo fora do diretorio publico.

```bash
set -e
cd /root/sistema-orcamento
mkdir -p backups
chmod 700 backups
docker compose -f docker-compose.production.yml exec -T postgres sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' > "backups/antes-equipamentos-$(date +%Y%m%d-%H%M%S).dump"
git pull --ff-only origin 001-sistema-orcamentos
docker compose -f docker-compose.production.yml build
docker compose -f docker-compose.production.yml run --rm --no-deps api npx --yes prisma@5.22.0 migrate deploy --schema backend/prisma/schema.prisma
docker compose -f docker-compose.production.yml up -d
```

O backup acima cobre PostgreSQL; nao exclua os volumes nem o armazenamento existente. A migracao precisa concluir com sucesso antes de iniciar a nova API. Se o Git informar conflito com alteracoes locais da VPS, preserve-as e resolva o conflito antes de continuar.
