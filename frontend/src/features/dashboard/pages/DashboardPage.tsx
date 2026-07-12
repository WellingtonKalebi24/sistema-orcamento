import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { DashboardSummary } from "../../../lib/api/schema";
import { formatCurrency } from "../../../lib/formatters/currency";
import { quoteStatusLabels, workOrderStatusLabels } from "../../../lib/formatters/labels";
import { getDashboardSummary } from "../api/dashboard.api";
import { DashboardCharts } from "../components/DashboardCharts";

type DetailKey = keyof DashboardSummary["details"];

const cardDescriptions: Record<DetailKey, string> = {
  quotesMonth: "Todos os orcamentos considerados no painel.",
  quotesApproved: "Orcamentos que chegaram ao status aprovado.",
  monthlyRevenue: "Soma dos valores recebidos em pagamentos pagos ou parciais.",
  estimatedProfit:
    "Soma do lucro estimado das OS nao canceladas: valor cobrado menos custo registrado.",
  openWorkOrders: "Ordens que ainda estao abertas.",
  inProgressServices: "Ordens atualmente em andamento.",
  lowStock: "Produtos com saldo igual ou inferior ao estoque minimo.",
  clients: "Clientes ativos cadastrados no sistema.",
};

export function DashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary>();
  const [selected, setSelected] = useState<DetailKey>();

  useEffect(() => {
    getDashboardSummary().then(setSummary);
  }, []);

  if (!summary) return <section className="panel">Carregando dashboard...</section>;

  const cards: Array<{ key: DetailKey; label: string; value: string | number }> = [
    { key: "quotesMonth", label: "Orcamentos", value: summary.cards.quotesMonth },
    { key: "quotesApproved", label: "Aprovados", value: summary.cards.quotesApproved },
    {
      key: "monthlyRevenue",
      label: "Receita recebida",
      value: summary.cards.monthlyRevenue
        ? formatCurrency(summary.cards.monthlyRevenue)
        : "Restrito",
    },
    {
      key: "estimatedProfit",
      label: "Lucro estimado",
      value: summary.cards.estimatedProfit
        ? formatCurrency(summary.cards.estimatedProfit)
        : "Restrito",
    },
    { key: "openWorkOrders", label: "OS abertas", value: summary.cards.openWorkOrders },
    {
      key: "inProgressServices",
      label: "Em andamento",
      value: summary.cards.inProgressServices,
    },
    { key: "lowStock", label: "Estoque baixo", value: summary.cards.lowStock },
    { key: "clients", label: "Clientes", value: summary.cards.clients },
  ];

  return (
    <>
      <section className="cards">
        {cards.map((card) => (
          <button
            className={`card dashboard-card${selected === card.key ? " selected" : ""}`}
            key={card.key}
            type="button"
            onClick={() => setSelected(selected === card.key ? undefined : card.key)}
          >
            <p>{card.label}</p>
            <strong>{card.value}</strong>
            <span>Ver composicao</span>
          </button>
        ))}
      </section>

      {selected ? (
        <DashboardDetail
          description={cardDescriptions[selected]}
          items={summary.details[selected]}
          title={cards.find((card) => card.key === selected)?.label ?? "Detalhes"}
          type={selected}
        />
      ) : null}

      <DashboardCharts summary={summary} />
      <section className="panels detail-panels">
        <div className="panel">
          <p className="eyebrow">Ultimos orcamentos</p>
          {summary.latestQuotes.map((quote) => (
            <Link className="history-link" key={quote.id} to={`/orcamentos/${quote.id}`}>
              {quote.number} - {quoteStatusLabels[quote.status]}
            </Link>
          ))}
        </div>
        <div className="panel">
          <p className="eyebrow">Ultimas OS</p>
          {summary.latestWorkOrders.map((order) => (
            <Link className="history-link" key={order.id} to={`/ordens/${order.id}`}>
              {order.number} - {workOrderStatusLabels[order.status]}
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

function DashboardDetail({
  title,
  description,
  type,
  items,
}: {
  title: string;
  description: string;
  type: DetailKey;
  items: DashboardSummary["details"][DetailKey];
}) {
  return (
    <section className="panel dashboard-detail">
      <div className="section-heading no-border">
        <div>
          <p className="eyebrow">Composicao do indicador</p>
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        <span className="count-badge">{items.length}</span>
      </div>
      <div className="table-card">
        {items.length === 0 ? <p>Nenhum registro compoe este indicador.</p> : null}
        {items.map((rawItem) => {
          const item = rawItem as Record<string, string | undefined>;
          const path =
            type === "quotesMonth" || type === "quotesApproved"
              ? `/orcamentos/${item.id}`
              : type === "openWorkOrders" ||
                  type === "inProgressServices" ||
                  type === "estimatedProfit"
                ? `/ordens/${item.id}`
                : type === "clients"
                  ? `/clientes/${item.id}`
                  : type === "lowStock"
                    ? "/produtos"
                    : "/financeiro";

          return (
            <Link className="table-row" key={item.id} to={path}>
              <strong>{item.number ?? item.name ?? "Pagamento"}</strong>
              <span>{item.client ?? item.document ?? item.status}</span>
              {item.estimatedProfit ? (
                <span>
                  Cobrado {formatCurrency(item.chargedAmount)} - custo{" "}
                  {formatCurrency(item.totalCost)} = lucro {formatCurrency(item.estimatedProfit)}
                </span>
              ) : null}
              {item.paidAmount ? <span>Recebido: {formatCurrency(item.paidAmount)}</span> : null}
              {item.amount && !item.paidAmount ? (
                <span>Valor: {formatCurrency(item.amount)}</span>
              ) : null}
              {item.stockQuantity ? (
                <span>
                  Saldo {item.stockQuantity} / minimo {item.minimumStock}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
