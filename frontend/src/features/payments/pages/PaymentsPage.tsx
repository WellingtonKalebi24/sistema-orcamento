import { useEffect, useState } from "react";

import type { Payment } from "../../../lib/api/schema";
import { formatCurrency } from "../../../lib/formatters/currency";
import { paymentMethodLabels, paymentStatusLabels } from "../../../lib/formatters/labels";
import { listPayments } from "../api/payments.api";
import { PaymentForm } from "../components/PaymentForm";

export function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);

  function reload() {
    listPayments()
      .then(setPayments)
      .catch(() => setPayments([]));
  }

  useEffect(reload, []);

  const total = payments.reduce((sum, payment) => sum + Number(payment.amount), 0);
  const received = payments
    .filter((payment) => payment.status !== "CANCELADO")
    .reduce((sum, payment) => sum + Number(payment.paidAmount), 0);
  const pending = Math.max(0, total - received);

  return (
    <section className="panel">
      <p className="eyebrow">Financeiro</p>
      <h2>Recebimentos dos servicos</h2>
      <p className="page-description">
        Escolha uma ordem de servico ou orcamento, informe quanto foi recebido e acompanhe o saldo
        restante no historico.
      </p>

      <section className="cards compact-cards finance-summary">
        <article className="card">
          <p>Total cobrado</p>
          <strong>{formatCurrency(total)}</strong>
        </article>
        <article className="card">
          <p>Total recebido</p>
          <strong>{formatCurrency(received)}</strong>
        </article>
        <article className="card">
          <p>Saldo pendente</p>
          <strong>{formatCurrency(pending)}</strong>
        </article>
      </section>

      <section className="form-step finance-form">
        <div className="step-number">1</div>
        <div className="step-content">
          <h3>Registrar um recebimento</h3>
          <p>O documento e o valor total sao carregados automaticamente.</p>
          <PaymentForm onDone={reload} />
        </div>
      </section>

      <div className="section-heading">
        <div>
          <h3>Historico financeiro</h3>
          <p>Confira valores pagos, pendentes e a forma utilizada.</p>
        </div>
        <span className="count-badge">{payments.length}</span>
      </div>
      <div className="table-card">
        {payments.length === 0 ? <p>Nenhum pagamento registrado.</p> : null}
        {payments.map((payment) => (
          <div className="table-row" key={payment.id}>
            <strong>{payment.workOrder?.number ?? payment.quote?.number ?? "Documento"}</strong>
            <span>{paymentStatusLabels[payment.status]}</span>
            <span>{paymentMethodLabels[payment.method]}</span>
            <span>
              Recebido {formatCurrency(payment.paidAmount)} de {formatCurrency(payment.amount)}
            </span>
            <span>
              Pendente:{" "}
              {formatCurrency(Math.max(0, Number(payment.amount) - Number(payment.paidAmount)))}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
