# OS, orcamentos e WhatsApp

A OS pode ser criada em Ordens > Nova OS sem orcamento anterior e sem itens. Preencha o cliente (pessoa ou empresa), equipamento e problema. A pagina da OS oferece Editar OS, Imprimir OS e Baixar PDF. Na edicao e possivel alterar equipamento, problema, itens, valores e observacoes. O cliente de uma OS existente permanece fixo.

Orcamentos sem OS/pagamentos vinculados podem ser editados; salvar devolve o documento a rascunho para nova aprovacao. Exclusao remove das listas, mas preserva o registro e os itens no banco. OS concluida, com baixa de estoque ou pagamentos nao pode ser excluida nem editada livremente. Orcamentos vinculados a OS ou pagamentos tambem sao protegidos. Uma OS excluida continua preservando seu vinculo com o orcamento original.

## WhatsApp

Informe o telefone do destinatario, inclusive outra empresa. Abrir WhatsApp abre a conversa com mensagem pronta; o PDF deve ser baixado e anexado manualmente.

Nao e necessario configurar WAHA. O envio da mensagem e confirmado pelo usuario no proprio WhatsApp.

## Atualizacao da VPS

```bash
cd /root/sistema-orcamento &&
git pull --ff-only origin 001-sistema-orcamentos &&
bash scripts/update-vps.sh
```

O script compila API e frontend, salva dump completo e uploads em backups/documentos-DATA-HORA, valida que o dump contem a tabela de usuarios e aplica as migracoes pendentes. A nova migracao apenas adiciona deletedAt a Quote e WorkOrder. Nao executa seed, reset, down ou remocao de volumes. A API fica brevemente indisponivel durante a migracao. Se ela falhar, o script inicia novamente o container anterior. Nao restaura backups automaticamente.
