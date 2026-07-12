# Guia rapido para demonstrar ao cliente

Este guia e para abrir o sistema em modo demonstracao, sem precisar configurar PostgreSQL ou Docker. O backend usa o modo local de desenvolvimento quando o banco nao esta disponivel.

## Opcao 1: usando o ZIP

1. Extraia o arquivo `sistema-orcamento-demo.zip`.
2. Entre na pasta extraida.
3. Execute `iniciar-demo-windows.bat`.
4. Aguarde abrir o navegador em `http://localhost:5173/login`.

Login:

- E-mail: `admin@sistema.local`
- Senha: `Admin@12345`

Para parar o sistema, execute `parar-demo-windows.bat`.

## Opcao 2: baixando do GitHub

```powershell
git clone https://github.com/WellingtonKalebi24/sistema-orcamento.git
cd sistema-orcamento
git checkout 001-sistema-orcamentos
npm install
npm run dev
```

Depois acesse:

```text
http://localhost:5173/login
```

## Roteiro sugerido de apresentacao

1. Entre no sistema com o usuario administrador.
2. Mostre o Dashboard e clique nos cards para explicar os valores.
3. Abra Clientes e cadastre um cliente de exemplo.
4. Abra Produtos e cadastre uma peca com estoque.
5. Abra Servicos e cadastre um servico.
6. Crie um Novo orcamento usando cliente, servico e produto.
7. Abra o detalhe do orcamento e gere/imprima o PDF.
8. Aprove o orcamento e gere uma Ordem de servico.
9. Conclua a OS e mostre a baixa automatica de estoque.
10. Abra Financeiro e registre um pagamento.
11. Mostre Relatorios e imprima o historico se necessario.
12. Abra Empresa para mostrar troca de nome, logo e cores do sistema.

## Observacoes para a demonstracao

- A criacao de orcamento nao baixa estoque.
- O estoque baixa somente ao concluir a OS ou por movimentacao manual.
- O PDF usa os dados e logo cadastrados em Empresa.
- Para atualizar a tela depois de uma alteracao, use `Ctrl + F5`.

## Requisitos da maquina

- Windows 10 ou superior.
- Node.js 22 ou superior.
- npm instalado junto com o Node.js.
- Navegador moderno, como Chrome, Edge ou Firefox.
