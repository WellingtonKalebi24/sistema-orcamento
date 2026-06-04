# Especificacao da Funcionalidade: Sistema de Orcamentos e Ordens de Servico

**Branch da Funcionalidade**: `001-sistema-orcamentos`

**Criada em**: 2026-05-23

**Status**: Rascunho

**Entrada**: Descricao do usuario: "Criar um sistema web completo, em portugues do Brasil, para clientes, orcamentos profissionais com PDF, ordens de servico, estoque, financeiro basico, dashboard, usuarios e configuracoes de uma empresa prestadora de servicos."

## Cenarios de Usuario e Testes *(obrigatorio)*

### Historia de Usuario 1 - Emitir orcamento profissional ao cliente (Prioridade: P1)

Uma atendente cadastra ou seleciona um cliente, descreve a solicitacao, inclui servicos e pecas, aplica descontos ou deslocamento quando necessario e entrega um orcamento claro em PDF para aprovacao do cliente.

**Por que esta prioridade**: O orcamento e a porta de entrada da receita e entrega valor mesmo antes de existirem controles operacionais mais avancados.

**Teste independente**: Pode ser testado cadastrando empresa, cliente, um servico e uma peca, criando o orcamento, conferindo calculos, alterando seu status para enviado e baixando o PDF correspondente.

**Cenarios de aceite**:

1. **Dado** que a atendente esta autorizada e existem dados da empresa e de um cliente, **Quando** ela cria um orcamento com itens, mao de obra, taxa e desconto, **Entao** o sistema calcula subtotais e total final, atribui numero unico e salva o orcamento como rascunho.
2. **Dado** um orcamento salvo, **Quando** a atendente o marca como enviado e solicita o PDF, **Entao** o documento apresenta dados da empresa e cliente, itens, valores, condicoes, validade, aceite e rodape para download.
3. **Dado** um orcamento enviado ainda valido, **Quando** a atendente registra a decisao informada pelo cliente, **Entao** o status passa a aprovado ou recusado e o historico do cliente reflete a decisao.

---

### Historia de Usuario 2 - Executar servico aprovado e consumir pecas (Prioridade: P2)

Um responsavel operacional transforma um orcamento aprovado em ordem de servico ou abre uma ordem avulsa, atribui um tecnico, acompanha a execucao e registra as pecas efetivamente usadas ate a conclusao.

**Por que esta prioridade**: A empresa precisa converter vendas aprovadas em trabalho rastreavel e manter o estoque coerente com a execucao real.

**Teste independente**: Pode ser testado aprovando um orcamento que contenha pecas em estoque, criando a ordem, atualizando seu andamento e concluindo-a para verificar a baixa unica das pecas e o historico de movimentacoes.

**Cenarios de aceite**:

1. **Dado** um orcamento aprovado, **Quando** um usuario autorizado solicita a conversao, **Entao** o sistema cria uma ordem de servico numerada com cliente, descricao, itens e valores originados do orcamento.
2. **Dado** um atendimento que nao exige orcamento previo, **Quando** um usuario autorizado abre uma ordem manual, **Entao** o sistema registra cliente, descricao, itens previstos e origem avulsa sem vinculo obrigatorio a orcamento.
3. **Dado** uma ordem aberta atribuida a um tecnico, **Quando** o tecnico registra evolucao, observacoes e anexos e muda o status, **Entao** a equipe visualiza o estado atualizado e os registros associados.
4. **Dado** uma ordem com pecas consumidas e saldo suficiente, **Quando** ela e concluida, **Entao** o sistema registra uma unica saida para cada peca, atualiza os saldos e sinaliza produtos abaixo do minimo.
5. **Dado** uma ordem ja concluida, **Quando** alguem tenta conclui-la novamente, **Entao** nenhuma baixa duplicada de estoque e criada.

---

### Historia de Usuario 3 - Manter cadastros e estoque operacional (Prioridade: P3)

Administrador e atendente mantem clientes e catalogos, enquanto usuarios autorizados registram entradas e saidas avulsas para que orcamentos e atendimentos usem informacoes confiaveis.

**Por que esta prioridade**: Os cadastros sustentam o fluxo principal e o saldo de pecas reduz atrasos e compras emergenciais.

**Teste independente**: Pode ser testado criando clientes, servicos e produtos, registrando uma entrada e uma saida autorizada e consultando saldo, alertas e historico.

**Cenarios de aceite**:

1. **Dado** um atendente autorizado, **Quando** ele registra um cliente com dados de contato e endereco, **Entao** o cliente fica disponivel para orcamentos e sua ficha oferece historico de orcamentos e servicos.
2. **Dado** um produto cadastrado com estoque minimo, **Quando** uma movimentacao deixa seu saldo abaixo desse limite, **Entao** o produto aparece como estoque baixo.
3. **Dado** um servico cadastrado com valor e tempo estimado, **Quando** ele e selecionado em um orcamento, **Entao** seus dados padrao sao carregados e podem ser ajustados para aquele orcamento sem alterar o cadastro original.

---

### Historia de Usuario 4 - Acompanhar recebimentos e resultados (Prioridade: P4)

O financeiro registra pagamentos de servicos e a administracao acompanha receita, custos, lucro estimado, volume de orcamentos e operacao em andamento no painel.

**Por que esta prioridade**: Uma vez que vendas e execucao sao registradas, a gestao precisa transformar os registros em decisoes de caixa e rentabilidade.

**Teste independente**: Pode ser testado concluindo ordens, registrando pagamentos em formas distintas e verificando os indicadores, listas recentes e relatorios do periodo.

**Cenarios de aceite**:

1. **Dado** uma ordem associada a um orcamento aprovado, **Quando** o financeiro registra um pagamento recebido, **Entao** valor, data e forma de pagamento ficam vinculados ao servico e seu saldo pendente e recalculado.
2. **Dado** movimentacoes do mes, **Quando** o administrador acessa o dashboard e seleciona o periodo, **Entao** ve totais de orcamentos, receita recebida, lucro estimado, ordens, clientes e estoque baixo, alem de graficos e listas recentes.
3. **Dado** ordens concluidas contendo pecas, **Quando** o gestor consulta produtos mais usados, **Entao** o relatorio ordena produtos pela quantidade efetivamente consumida no periodo.

---

### Historia de Usuario 5 - Administrar empresa, usuarios e acesso (Prioridade: P5)

Um administrador configura a identidade exibida nos documentos e gerencia usuarios por funcao, garantindo que cada equipe acesse apenas o trabalho necessario.

**Por que esta prioridade**: Protecao de dados e identidade profissional sao essenciais para uso real, embora possam ser configuradas depois do fluxo basico demonstravel.

**Teste independente**: Pode ser testado cadastrando os dados e logo da empresa, criando usuarios de cada funcao e verificando que paginas, acoes e valores respeitam as permissoes.

**Cenarios de aceite**:

1. **Dado** um administrador autenticado, **Quando** ele define dados comerciais, contato, pagamento, logo e textos padrao, **Entao** novos PDFs passam a apresentar a identidade configurada.
2. **Dado** usuarios dos perfis atendente, tecnico e financeiro, **Quando** cada um entra no sistema, **Entao** apenas os modulos e acoes permitidos para sua funcao ficam acessiveis.
3. **Dado** um tecnico sem permissao financeira, **Quando** ele tenta acessar indicadores financeiros ou pagamentos, **Entao** o acesso e negado sem expor os valores protegidos.

### Casos Limite

- Um orcamento vencido sem decisao do cliente e marcado como expirado e nao pode originar ordem sem nova aprovacao registrada.
- Um orcamento aprovado nao pode ser convertido em mais de uma ordem de servico ativa.
- Valores negativos, descontos maiores que o subtotal ou quantidades nulas/negativas sao rejeitados antes de salvar.
- A conclusao de uma ordem com saldo insuficiente de uma peca e bloqueada ate ajuste dos itens ou registro de entrada autorizado, salvo quando o administrador habilitou explicitamente estoque negativo.
- O cancelamento de uma ordem antes da conclusao nao movimenta estoque; ajustes apos uma baixa exigem movimentacao de correcao rastreavel.
- Um produto ou servico ja referenciado nao e removido do historico; ele pode ser inativado para novos lancamentos.
- Um cliente com CPF/CNPJ ja cadastrado e alertado para evitar duplicidade, permitindo correcao por usuario autorizado.
- Falha ao gerar documento ou enviar anexo preserva o registro principal e informa ao usuario como tentar novamente.
- Pagamentos parciais mantem saldo pendente; estorno ou correcao preserva trilha do lancamento anterior.
- A alteracao posterior de dados da empresa, cliente, produto ou servico nao altera os dados e valores historicos ja emitidos em um orcamento.

## Requisitos *(obrigatorio)*

### Requisitos Funcionais

#### Acesso, usuarios e configuracao empresarial

- **FR-001**: O sistema MUST exigir autenticacao por login e senha para acessar informacoes administrativas.
- **FR-002**: O sistema MUST permitir que administradores criem, editem, ativem e desativem usuarios com os perfis Administrador, Atendente, Tecnico e Financeiro.
- **FR-003**: O sistema MUST aplicar autorizacao por perfil em telas e acoes: Administrador acessa todos os modulos; Atendente gerencia clientes e orcamentos; Tecnico consulta e atualiza ordens atribuidas ou disponibilizadas para execucao; Financeiro consulta valores, pagamentos e relatorios financeiros.
- **FR-004**: O sistema MUST impedir que usuarios nao autorizados visualizem ou alterem valores financeiros, configuracoes empresariais ou gestao de usuarios.
- **FR-005**: Administradores MUST poder cadastrar nome empresarial, CNPJ, logo, telefone, WhatsApp, e-mail, endereco, dados bancarios ou Pix, texto padrao do orcamento e texto padrao de rodape.
- **FR-006**: O sistema MUST registrar quem realizou alteracoes relevantes de status, estoque e pagamentos, com data e hora para rastreabilidade.

#### Clientes, produtos e servicos

- **FR-007**: Usuarios autorizados MUST poder cadastrar e atualizar clientes com nome ou razao social, CPF/CNPJ, telefone/WhatsApp, e-mail, endereco completo e observacoes.
- **FR-008**: O sistema MUST disponibilizar na ficha do cliente seus orcamentos e ordens de servico, com numero, data, status e acesso aos detalhes permitidos ao usuario.
- **FR-009**: O sistema MUST alertar sobre CPF/CNPJ ja utilizado antes de concluir novo cadastro de cliente.
- **FR-010**: Usuarios autorizados MUST poder cadastrar produtos ou pecas com nome, codigo/SKU unico, categoria, estoque minimo, preco de custo, preco de venda e fornecedor.
- **FR-011**: O sistema MUST manter saldo atual e historico de entradas, saidas e correcoes de cada produto, incluindo quantidade, motivo, referencia e usuario responsavel.
- **FR-012**: O sistema MUST destacar produtos cujo saldo atual esteja abaixo ou igual ao estoque minimo configurado.
- **FR-013**: Usuarios autorizados MUST poder cadastrar servicos com nome, descricao, valor padrao, tempo estimado e categoria, podendo inativar itens que nao devem mais ser oferecidos.

#### Orcamentos e documento para cliente

- **FR-014**: Atendentes e administradores MUST poder criar orcamentos vinculados a um cliente, com numero unico, data de emissao, validade, descricao do problema ou solicitacao, observacoes, condicoes de pagamento e prazo de execucao.
- **FR-015**: Cada orcamento MUST aceitar itens de servico e de produto/peca com descricao registrada no momento da emissao, quantidade, valor unitario, desconto por item e subtotal.
- **FR-016**: Cada orcamento MUST aceitar valor de mao de obra, taxa de deslocamento e desconto geral, exibindo subtotal, descontos por item, desconto geral e total final calculado.
- **FR-017**: O sistema MUST validar que quantidades e valores monetarios sejam validos e que o desconto nao gere total final negativo.
- **FR-018**: O sistema MUST controlar os status Rascunho, Enviado, Aprovado, Recusado e Expirado, preservando data, usuario e observacao das mudancas.
- **FR-019**: O sistema MUST identificar orcamentos enviados que ultrapassaram a validade sem aprovacao e apresenta-los como expirados.
- **FR-020**: O sistema MUST gerar para download um PDF do orcamento contendo logo e dados da empresa, dados do cliente, numero, datas, solicitacao, servicos, produtos, quantidades, valores, subtotais, desconto, total, pagamento, observacoes, aceite do cliente, assinatura da empresa e rodape de contato.
- **FR-021**: O PDF MUST refletir os dados historicos do orcamento emitido, sem mudar quando cadastros utilizados forem posteriormente editados.
- **FR-022**: O sistema MUST permitir localizar e filtrar orcamentos por numero, cliente, periodo e status.

#### Ordens de servico e execucao

- **FR-023**: Administradores e atendentes MUST poder criar uma ordem manual ou transformar um orcamento aprovado e ainda nao convertido em uma unica ordem de servico vinculada ao orcamento.
- **FR-024**: A ordem de servico MUST receber numero unico, cliente, referencia opcional ao orcamento, tecnico responsavel, data de abertura, data prevista, descricao, itens previstos e observacoes internas.
- **FR-025**: O sistema MUST controlar os status de ordem Aberta, Em andamento, Aguardando peca, Concluida e Cancelada, com historico de mudancas.
- **FR-026**: Usuarios tecnicos autorizados MUST poder atualizar status operacional, data de conclusao, descricao da execucao, pecas efetivamente utilizadas e observacoes internas das ordens que podem executar.
- **FR-027**: O sistema MUST permitir anexar fotos ou documentos a uma ordem de servico, identificando autoria e data de inclusao.
- **FR-028**: O sistema MUST permitir registrar aceite ou assinatura do cliente associada a ordem concluida.
- **FR-029**: O sistema MUST permitir localizar e filtrar ordens por numero, cliente, tecnico, periodo e status.

#### Estoque, financeiro e indicadores

- **FR-030**: Ao concluir uma ordem, o sistema MUST registrar automaticamente e uma unica vez a saida das quantidades de pecas efetivamente usadas.
- **FR-031**: O sistema MUST bloquear por padrao a conclusao que produziria saldo negativo e informar quais pecas exigem reposicao ou ajuste; somente administrador MUST poder habilitar configuracao explicita para permitir saldo negativo.
- **FR-032**: Usuarios autorizados MUST poder registrar entradas e saidas avulsas de estoque com justificativa, sem alterar silenciosamente movimentacoes originadas de ordens.
- **FR-033**: O sistema MUST apresentar relatorio de produtos mais usados com base em saidas ligadas a ordens concluidas e periodo selecionado.
- **FR-034**: O sistema MUST calcular por ordem e por periodo o custo das pecas utilizadas, custo de mao de obra informado, valor cobrado e lucro estimado.
- **FR-035**: Usuarios financeiros e administradores MUST poder registrar pagamentos vinculados a ordens ou seus orcamentos, contendo valor, vencimento, data de pagamento, situacao Pendente, Parcial, Pago ou Cancelado, observacoes e forma Dinheiro, Pix, Cartao, Boleto ou Transferencia.
- **FR-036**: O sistema MUST indicar servicos pagos, parcialmente pagos e pendentes com base no valor cobrado e nos pagamentos confirmados.
- **FR-037**: O sistema MUST apresentar indicadores do periodo para quantidade de orcamentos, aprovados, recusados, receita recebida, lucro estimado, servicos em andamento, ordens abertas, itens com estoque baixo e clientes cadastrados.
- **FR-038**: O dashboard MUST apresentar grafico de faturamento mensal, distribuicao por status de orcamentos, produtos mais usados, ultimos orcamentos e ultimas ordens de servico.
- **FR-039**: O sistema MUST permitir consultar relatorios por periodo de orcamentos, ordens, pagamentos, rentabilidade e movimentacoes de estoque de acordo com a permissao do usuario.

#### Experiencia e integridade operacional

- **FR-040**: O sistema MUST oferecer paginas de login, dashboard, clientes, novo cliente, produtos/estoque, servicos, orcamentos, novo orcamento, detalhe e PDF do orcamento, ordens de servico, nova ordem, financeiro, relatorios, configuracoes da empresa e usuarios.
- **FR-041**: As paginas MUST oferecer navegacao em menu lateral, resumos em cards quando aplicavel, tabelas com busca e filtros e acoes claramente identificadas.
- **FR-042**: A experiencia MUST ser utilizavel em computadores e dispositivos moveis para consultas e atualizacoes essenciais.
- **FR-043**: O sistema MUST preservar registros historicos referenciados por documentos, ordens, movimentacoes ou pagamentos, permitindo inativacao em vez de exclusao destrutiva.
- **FR-044**: O sistema MUST apresentar mensagens claras para falhas de validacao, falta de permissao, saldo insuficiente e falha de geracao de documento ou anexo.

### Resumo de Permissoes

| Modulo ou acao | Administrador | Atendente | Tecnico | Financeiro |
|-----------------|---------------|-----------|---------|------------|
| Configuracoes e usuarios | Gerencia | Sem acesso | Sem acesso | Sem acesso |
| Clientes | Gerencia | Gerencia | Consulta para atendimento | Consulta permitida para cobranca |
| Produtos e servicos | Gerencia | Consulta para orcar | Consulta para executar | Consulta de custos |
| Orcamentos | Gerencia | Cria e acompanha | Consulta vinculada a OS | Consulta valores e status |
| Ordens de servico | Gerencia | Cria a partir de aprovacao e consulta | Atualiza execucao | Consulta para pagamento |
| Estoque | Gerencia e movimenta | Consulta disponibilidade | Registra consumo via OS | Consulta custos |
| Pagamentos e relatorios financeiros | Gerencia | Sem acesso financeiro | Sem acesso financeiro | Gerencia |
| Dashboard | Completo | Operacional sem valores restritos | Operacional | Financeiro |

### Entidades Principais

- **Usuario**: Pessoa que acessa o sistema, com credenciais, perfil de permissao, situacao ativa ou inativa e rastreabilidade das acoes.
- **Cliente**: Pessoa fisica ou juridica atendida, com identificacao, contato, endereco, observacoes e historico relacionado.
- **Configuracao da Empresa**: Identidade e informacoes comerciais usadas na operacao e nos documentos emitidos.
- **Produto/Peca**: Item estocavel oferecido ou utilizado em atendimento, com identificacao, precos, fornecedor e limite minimo.
- **Movimentacao de Estoque**: Entrada, saida ou correcao rastreavel de um produto, possivelmente originada por uma ordem.
- **Servico**: Atividade comercializavel, com descricao, categoria, valor padrao e tempo estimado.
- **Orcamento**: Proposta enviada a um cliente, com validade, composicao de valores, condicoes e ciclo de aprovacao.
- **Item de Orcamento**: Linha historica de servico ou produto com descricao, quantidade, valor unitario, custo aplicavel e subtotal.
- **Ordem de Servico**: Execucao operacional originada de um orcamento aprovado, atribuida a um tecnico e acompanhada por status.
- **Item de Ordem de Servico**: Servico ou peca prevista/efetivamente utilizada na execucao, base para custo e estoque.
- **Pagamento**: Recebimento ou ajuste financeiro vinculado ao trabalho cobrado, com forma, valor, situacao e data.
- **Anexo**: Foto, documento ou registro de aceite associado a uma ordem, com autoria e data.

## Criterios de Sucesso *(obrigatorio)*

### Resultados Mensuraveis

- **SC-001**: Um atendente treinado consegue cadastrar um cliente, montar um orcamento com pelo menos cinco itens e baixar seu PDF em ate 5 minutos, sem ajuda externa.
- **SC-002**: Em testes de aceite, 100% dos PDFs gerados exibem numero, empresa, cliente, validade, composicao de valores, total e informacoes de contato consistentes com o orcamento salvo.
- **SC-003**: Em testes de ciclo completo, 100% das ordens concluidas reduzem o estoque exatamente uma vez pelas quantidades utilizadas e nenhuma ordem cancelada antes da conclusao altera o saldo.
- **SC-004**: Gestores conseguem identificar orcamentos, ordens em andamento, estoque baixo, pagamentos pendentes e lucro estimado de um periodo em ate 2 minutos a partir do dashboard e relatorios.
- **SC-005**: Em testes de permissao, 100% das tentativas de um perfil acessar acao ou valor nao autorizado sao negadas e nenhuma informacao restrita e exibida.
- **SC-006**: Para consultas usuais com ate 10.000 clientes, 20.000 orcamentos, 10.000 ordens e 5.000 produtos, usuarios visualizam listas filtradas e indicadores em ate 3 segundos em pelo menos 95% das tentativas.
- **SC-007**: Pelo menos 90% dos usuarios representantes de atendimento, tecnica e financeiro concluem suas tarefas principais na primeira tentativa durante validacao guiada de usabilidade.

## Premissas

- A primeira versao atende uma unica empresa prestadora de servicos, com multiplos usuarios internos e moeda brasileira.
- CPF/CNPJ e dados de contato sao armazenados para fins operacionais e de emissao de documentos, com acesso restrito conforme funcao.
- O envio do PDF ao cliente ocorre fora do sistema apos o download; o escopo inicial nao inclui disparo automatico por WhatsApp ou e-mail.
- A aprovacao ou recusa e registrada por um usuario interno com base no retorno do cliente; portal externo de autoaprovacao nao faz parte desta feature.
- A baixa automatica no estoque ocorre na conclusao da ordem, quando o consumo real ja foi confirmado, e nunca na simples aprovacao do orcamento; a configuracao de estoque negativo inicia desabilitada.
- O custo de mao de obra e informado na operacao para permitir lucro estimado; folha de pagamento, impostos e contabilidade completa estao fora do escopo.
- Pagamentos podem ser parciais e sao registrados manualmente; emissao fiscal, conciliacao bancaria e cobranca automatica nao fazem parte da primeira versao.
- Fotos, anexos e aceite do cliente fazem parte do registro operacional; assinatura com certificacao digital formal nao e exigida nesta versao.
- O usuario espera que a etapa posterior de planejamento considere as tecnologias solicitadas para interface, servico de aplicacao e armazenamento relacional, sem alterar estes requisitos de negocio.
