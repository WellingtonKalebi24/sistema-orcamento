import { useEffect, useState } from "react";

import type { Payment } from "../../../lib/api/schema";
import { formatCurrency } from "../../../lib/formatters/currency";
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

  return (
    <section className="panel">
      <p className="eyebrow">Financeiro</p>
      <h2>Pagamentos e recebimentos</h2>
      <PaymentForm onDone={reload} />
      <div className="table-card">
        {payments.map((payment) => (
          <div className="table-row" key={payment.id}>
            <strong>{payment.status}</strong>
            <span>{payment.method}</span>
            <span>
              {formatCurrency(payment.paidAmount)} / {formatCurrency(payment.amount)}
            </span>
            <span>{payment.workOrder?.number ?? payment.quote?.number ?? "Documento"}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
