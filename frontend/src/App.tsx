const summaryCards = [
  { label: "Orcamentos no mes", value: "--", hint: "Modulo em preparacao" },
  { label: "Ordens abertas", value: "--", hint: "Modulo em preparacao" },
  { label: "Estoque baixo", value: "--", hint: "Modulo em preparacao" },
  { label: "Receita mensal", value: "R$ --", hint: "Modulo em preparacao" },
];

const navigation = [
  "Dashboard",
  "Clientes",
  "Produtos e estoque",
  "Servicos",
  "Orcamentos",
  "Ordens de servico",
  "Financeiro",
  "Relatorios",
  "Configuracoes",
];

export function App() {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">SO</span>
          <div>
            <strong>Sistema OS</strong>
            <p>Gestao de servicos</p>
          </div>
        </div>
        <nav aria-label="Menu principal">
          {navigation.map((item, index) => (
            <button className={index === 0 ? "nav-item active" : "nav-item"} key={item}>
              {item}
            </button>
          ))}
        </nav>
        <div className="sidebar-footer">
          <span className="status-dot" />
          Fundacao instalada
        </div>
      </aside>

      <main className="content">
        <header className="page-header">
          <div>
            <p className="eyebrow">Painel administrativo</p>
            <h1>Visao geral</h1>
          </div>
          <div className="profile">
            <div>
              <strong>Administrador</strong>
              <p>Ambiente local</p>
            </div>
            <span className="avatar">A</span>
          </div>
        </header>

        <section className="cards" aria-label="Indicadores principais">
          {summaryCards.map((card) => (
            <article className="card" key={card.label}>
              <p>{card.label}</p>
              <strong>{card.value}</strong>
              <span>{card.hint}</span>
            </article>
          ))}
        </section>

        <section className="panels">
          <article className="panel welcome">
            <p className="eyebrow">Setup concluido</p>
            <h2>Pronto para implementar o fluxo comercial</h2>
            <p>
              A interface base esta preparada para receber clientes, orcamentos, ordens de servico,
              estoque e indicadores nas proximas fases.
            </p>
            <div className="actions">
              <button className="button-primary">Novo orcamento</button>
              <button className="button-secondary">Ver tarefas</button>
            </div>
          </article>
          <article className="panel checklist">
            <h2>Proximos modulos</h2>
            <ul>
              <li>
                <span className="check completed" /> Infraestrutura inicial
              </li>
              <li>
                <span className="check" /> Autenticacao e permissoes
              </li>
              <li>
                <span className="check" /> Orcamentos e PDF
              </li>
              <li>
                <span className="check" /> Ordem de servico e estoque
              </li>
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
}
