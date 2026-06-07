import { useEffect, useState } from "react";

import type { DashboardSummary } from "../../../lib/api/schema";
import { formatCurrency } from "../../../lib/formatters/currency";
import { getDashboardSummary } from "../api/dashboard.api";
import { DashboardCharts } from "../components/DashboardCharts";

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>();

  useEffect(() => {
    getDashboardSummary().then(setSummary);
  }, []);

  if (!summary) return <section className="panel">Carregando dashboard...</section>;

  const cards = [
    ["Orcamentos no mes", summary.cards.quotesMonth],
    ["Aprovados", summary.cards.quotesApproved],
    [
      "Receita mensal",
      summary.cards.monthlyRevenue ? formatCurrency(summary.cards.monthlyRevenue) : "Restrito",
    ],
    [
      "Lucro estimado",
      summary.cards.estimatedProfit ? formatCurrency(summary.cards.estimatedProfit) : "Restrito",
    ],
    ["OS abertas", summary.cards.openWorkOrders],
    ["Em andamento", summary.cards.inProgressServices],
    ["Estoque baixo", summary.cards.lowStock],
    ["Clientes", summary.cards.clients],
  ];

  return (
    <>
      <section className="cards">
        {cards.map(([label, value]) => (
          <article className="card" key={label}>
            <p>{label}</p>
            <strong>{value}</strong>
            <span>Atualizado pela API</span>
          </article>
        ))}
      </section>
      <DashboardCharts summary={summary} />
      <section className="panels detail-panels">
        <div className="panel">
          <p className="eyebrow">Ultimos orcamentos</p>
          {summary.latestQuotes.map((quote) => (
            <p key={quote.id}>
              {quote.number} - {quote.status}
            </p>
          ))}
        </div>
        <div className="panel">
          <p className="eyebrow">Ultimas OS</p>
          {summary.latestWorkOrders.map((order) => (
            <p key={order.id}>
              {order.number} - {order.status}
            </p>
          ))}
        </div>
      </section>
    </>
  );
}
