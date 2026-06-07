import { useState } from "react";

import { createPayment } from "../api/payments.api";

export function PaymentForm({ onDone }: { onDone: () => void }) {
  const [targetType, setTargetType] = useState<"quoteId" | "workOrderId">("workOrderId");
  const [form, setForm] = useState({
    targetId: "",
    method: "PIX",
    amount: "0.00",
    paidAmount: "0.00",
    dueDate: "",
    notes: "",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    await createPayment({
      [targetType]: form.targetId,
      method: form.method,
      amount: form.amount,
      paidAmount: form.paidAmount,
      dueDate: form.dueDate || undefined,
      notes: form.notes,
    });
    onDone();
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>
        Vinculo
        <select
          value={targetType}
          onChange={(event) => setTargetType(event.target.value as "quoteId" | "workOrderId")}
        >
          <option value="workOrderId">Ordem de servico</option>
          <option value="quoteId">Orcamento</option>
        </select>
      </label>
      <label>
        ID do documento
        <input
          value={form.targetId}
          onChange={(event) => update("targetId", event.target.value)}
          required
        />
      </label>
      <label>
        Forma
        <select value={form.method} onChange={(event) => update("method", event.target.value)}>
          <option value="DINHEIRO">Dinheiro</option>
          <option value="PIX">Pix</option>
          <option value="CARTAO">Cartao</option>
          <option value="BOLETO">Boleto</option>
          <option value="TRANSFERENCIA">Transferencia</option>
        </select>
      </label>
      <label>
        Valor
        <input value={form.amount} onChange={(event) => update("amount", event.target.value)} />
      </label>
      <label>
        Valor pago
        <input
          value={form.paidAmount}
          onChange={(event) => update("paidAmount", event.target.value)}
        />
      </label>
      <label>
        Vencimento
        <input
          type="date"
          value={form.dueDate}
          onChange={(event) => update("dueDate", event.target.value)}
        />
      </label>
      <label className="span-2">
        Observacoes
        <textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} />
      </label>
      <button className="button-primary" type="submit">
        Registrar pagamento
      </button>
    </form>
  );
}
