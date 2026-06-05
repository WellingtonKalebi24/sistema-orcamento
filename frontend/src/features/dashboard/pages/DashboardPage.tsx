const cards = [
  ["Orcamentos no mes", "MVP"],
  ["Orcamentos aprovados", "Pronto"],
  ["PDF", "Download"],
  ["Estoque", "Sem baixa no orcamento"],
];

export function DashboardPage() {
  return (
    <>
      <section className="cards">
        {cards.map(([label, value]) => (
          <article className="card" key={label}>
            <p>{label}</p>
            <strong>{value}</strong>
            <span>Fase 3 habilitada</span>
          </article>
        ))}
      </section>
      <section className="panel welcome">
        <p className="eyebrow">MVP comercial</p>
        <h2>Cadastre cliente, monte orcamento e baixe PDF profissional.</h2>
        <p>
          O fluxo inicial ja usa autenticacao JWT, RBAC no backend e calculo decimal no servidor.
        </p>
      </section>
    </>
  );
}
