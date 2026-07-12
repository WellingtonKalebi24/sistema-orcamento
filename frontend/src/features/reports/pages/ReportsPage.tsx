import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { formatCurrency } from "../../../lib/formatters/currency";
import {
  paymentStatusLabels,
  quoteStatusLabels,
  workOrderStatusLabels,
} from "../../../lib/formatters/labels";
import { getReports } from "../api/reports.api";

type Reports = Awaited<ReturnType<typeof getReports>>;
type Section = "quotes" | "workOrders" | "payments" | "stock";

export function ReportsPage() {
  const [reports, setReports] = useState<Reports>();
  const [section, setSection] = useState<Section>("quotes");

  useEffect(() => {
    getReports().then(setReports);
  }, []);

  if (!reports) return <section className="panel">Carregando relatorios...</section>;

  const received = reports.payments
    .filter((payment) => payment.status === "PAGO" || payment.status === "PARCIAL")
    .reduce((total, payment) => total + Number(payment.paidAmount), 0);

  return (
    <section className="panel reports-page">
      <div className="page-header inline-header">
        <div>
          <p className="eyebrow">Relatorios e historico</p>
          <h2>Acompanhe tudo o que ocorreu no sistema</h2>
        </div>
        <button
          className="button-secondary print-hidden"
          type="button"
          onClick={() => window.print()}
        >
          Imprimir relatorio
        </button>
      </div>

      <section className="cards compact-cards">
        <button className="card dashboard-card" type="button" onClick={() => setSection("quotes")}>
          <p>Orcamentos</p>
          <strong>{reports.quotes.length}</strong>
        </button>
        <button
          className="card dashboard-card"
          type="button"
          onClick={() => setSection("workOrders")}
        >
          <p>Ordens de servico</p>
          <strong>{reports.workOrders.length}</strong>
        </button>
        <button
          className="card dashboard-card"
          type="button"
          onClick={() => setSection("payments")}
        >
          <p>Total recebido</p>
          <strong>{formatCurrency(received)}</strong>
        </button>
        <button className="card dashboard-card" type="button" onClick={() => setSection("stock")}>
          <p>Estoque baixo</p>
          <strong>{reports.stock.filter((item) => item.lowStock).length}</strong>
        </button>
      </section>

      <div className="report-tabs print-hidden">
        <button
          className={section === "quotes" ? "active" : ""}
          onClick={() => setSection("quotes")}
        >
          Orcamentos
        </button>
        <button
          className={section === "workOrders" ? "active" : ""}
          onClick={() => setSection("workOrders")}
        >
          Ordens de servico
        </button>
        <button
          className={section === "payments" ? "active" : ""}
          onClick={() => setSection("payments")}
        >
          Pagamentos
        </button>
        <button className={section === "stock" ? "active" : ""} onClick={() => setSection("stock")}>
          Estoque
        </button>
      </div>

      <div className="table-card report-history">
        {section === "quotes"
          ? reports.quotes.map((quote) => (
              <Link className="table-row" key={quote.id} to={`/orcamentos/${quote.id}`}>
                <strong>{quote.number}</strong>
                <span>{quote.client?.name ?? "Cliente"}</span>
                <span>{quoteStatusLabels[quote.status]}</span>
                <span>{formatCurrency(quote.totalAmount)}</span>
              </Link>
            ))
          : null}
        {section === "workOrders"
          ? reports.workOrders.map((order) => (
              <Link className="table-row" key={order.id} to={`/ordens/${order.id}`}>
                <strong>{order.number}</strong>
                <span>{order.client?.name ?? "Cliente"}</span>
                <span>{workOrderStatusLabels[order.status]}</span>
                <span>{formatCurrency(order.chargedAmount)}</span>
              </Link>
            ))
          : null}
        {section === "payments"
          ? reports.payments.map((payment) => (
              <div className="table-row" key={payment.id}>
                <strong>{payment.workOrder?.number ?? payment.quote?.number ?? "Documento"}</strong>
                <span>{paymentStatusLabels[payment.status]}</span>
                <span>Recebido: {formatCurrency(payment.paidAmount)}</span>
                <span>Total: {formatCurrency(payment.amount)}</span>
              </div>
            ))
          : null}
        {section === "stock"
          ? reports.stock.map((item) => (
              <Link className="table-row" key={item.id} to="/produtos">
                <strong>{item.name}</strong>
                <span>Saldo: {item.stockQuantity}</span>
                <span>Minimo: {item.minimumStock}</span>
                <span>{item.lowStock ? "Reposicao necessaria" : "Estoque normal"}</span>
              </Link>
            ))
          : null}
      </div>
    </section>
  );
}
