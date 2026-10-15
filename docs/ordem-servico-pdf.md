# PDF da ordem de serviço

Abra uma ordem de serviço e clique em **Baixar PDF**. O documento A4 segue o formulário de assistência técnica: identificação da empresa e logo, cliente, datas, equipamento e número de série, problema, totais, observações, técnico e assinatura.

- A logo e os contatos vêm das configurações atuais da empresa.
- Data/hora de entrada correspondem à abertura da OS; conclusão só aparece após a conclusão. Não há horário de início de execução separado no cadastro.
- Observações do recebimento ficam em branco para preenchimento manual, pois não existe campo específico no cadastro atual.
- Observações do serviço usam as observações para o cliente; informações do técnico usam a descrição da execução. Observações internas, custos e lucro não são impressos.
- Serviços e peças usam os preços dos itens. O total usa o valor cobrado da OS; diferenças são identificadas como ajustes, sem alterar os valores cadastrados.
- Textos extensos continuam em páginas adicionais. O PDF representa os dados atuais da OS.

## Atualização na VPS

Esta alteração não adiciona migrações de banco de dados.

```bash
cd /root/sistema-orcamento &&
git pull --ff-only origin 001-sistema-orcamentos &&
docker compose -f docker-compose.production.yml up -d --build api web
```

Atualize a página com Ctrl+F5 após a atualização.
