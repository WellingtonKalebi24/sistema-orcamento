import { useEffect, useState } from "react";

import { getReports } from "../api/reports.api";

type Reports = Awaited<ReturnType<typeof getReports>>;

export function ReportsPage() {
  const [reports, setReports] = useState<Reports>();

  useEffect(() => {
    getReports().then(setReports);
  }, []);

  if (!reports) return <section className="panel">Carregando relatorios...</section>;

  return (
    <section className="panel">
      <p className="eyebrow">Relatorios</p>
      <h2>Resumo operacional e financeiro</h2>
      <section className="cards">
        <article className="card">
          <p>Orcamentos</p>
          <strong>{reports.quotes.length}</strong>
        </article>
        <article className="card">
          <p>Ordens de servico</p>
          <strong>{reports.workOrders.length}</strong>
        </article>
        <article className="card">
          <p>Pagamentos</p>
          <strong>{reports.payments.length}</strong>
        </article>
        <article className="card">
          <p>Produtos em estoque baixo</p>
          <strong>{reports.stock.filter((item) => item.lowStock).length}</strong>
        </article>
      </section>
      <div className="table-card">
        {reports.stock.map((item) => (
          <p key={item.id}>
            {item.name}: {item.stockQuantity} {item.lowStock ? "(baixo)" : ""}
          </p>
        ))}
      </div>
    </section>
  );
}
