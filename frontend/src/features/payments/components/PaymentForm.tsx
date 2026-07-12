import { useEffect, useMemo, useState } from "react";

import { CurrencyInput } from "../../../components/forms/CurrencyInput";
import { getApiErrorMessage } from "../../../lib/api/errors";
import type { Quote, WorkOrder } from "../../../lib/api/schema";
import { formatCurrency } from "../../../lib/formatters/currency";
import { paymentMethodLabels } from "../../../lib/formatters/labels";
import { listQuotes } from "../../quotes/api/quotes.api";
import { listWorkOrders } from "../../work-orders/api/work-orders.api";
import { createPayment } from "../api/payments.api";

type TargetType = "quoteId" | "workOrderId";

export function PaymentForm({ onDone }: { onDone: () => void }) {
  const [targetType, setTargetType] = useState<TargetType>("workOrderId");
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);
  const [form, setForm] = useState({
    targetId: "",
    method: "PIX",
    amount: "0.00",
    paidAmount: "0.00",
    dueDate: "",
    notes: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    Promise.all([listQuotes(), listWorkOrders()])
      .then(([quoteData, workOrderData]) => {
        setQuotes(quoteData);
        setWorkOrders(workOrderData);
      })
      .catch((caught) =>
        setError(getApiErrorMessage(caught, "Nao foi possivel carregar os documentos.")),
      );
  }, []);

  const documents = useMemo(
    () => (targetType === "quoteId" ? quotes : workOrders),
    [quotes, targetType, workOrders],
  );

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function changeTargetType(nextType: TargetType) {
    setTargetType(nextType);
    setForm((current) => ({ ...current, targetId: "", amount: "0.00" }));
  }

  function selectDocument(documentId: string) {
    const document = documents.find((item) => item.id === documentId);
    const amount =
      document && "totalAmount" in document ? document.totalAmount : document?.chargedAmount;

    setForm((current) => ({
      ...current,
      targetId: documentId,
      amount: amount ?? "0.00",
    }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await createPayment({
        [targetType]: form.targetId,
        method: form.method,
        amount: form.amount,
        paidAmount: form.paidAmount,
        dueDate: form.dueDate || undefined,
        notes: form.notes,
      });
      setForm({
        targetId: "",
        method: "PIX",
        amount: "0.00",
        paidAmount: "0.00",
        dueDate: "",
        notes: "",
      });
      setSuccess("Pagamento registrado com sucesso.");
      onDone();
    } catch (caught) {
      setError(getApiErrorMessage(caught, "Nao foi possivel registrar o pagamento."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>
        Tipo de documento
        <select
          value={targetType}
          onChange={(event) => changeTargetType(event.target.value as TargetType)}
        >
          <option value="workOrderId">Ordem de servico</option>
          <option value="quoteId">Orcamento</option>
        </select>
      </label>
      <label>
        Documento *
        <select
          value={form.targetId}
          onChange={(event) => selectDocument(event.target.value)}
          required
        >
          <option value="">Selecione pelo numero e cliente...</option>
          {documents.map((document) => (
            <option key={document.id} value={document.id}>
              {document.number} - {document.client?.name ?? "Cliente"} -{" "}
              {formatCurrency(
                "totalAmount" in document ? document.totalAmount : document.chargedAmount,
              )}
            </option>
          ))}
        </select>
      </label>
      <label>
        Forma de pagamento
        <select value={form.method} onChange={(event) => update("method", event.target.value)}>
          <option value="DINHEIRO">{paymentMethodLabels.DINHEIRO}</option>
          <option value="PIX">{paymentMethodLabels.PIX}</option>
          <option value="CARTAO">{paymentMethodLabels.CARTAO}</option>
          <option value="BOLETO">{paymentMethodLabels.BOLETO}</option>
          <option value="TRANSFERENCIA">{paymentMethodLabels.TRANSFERENCIA}</option>
        </select>
      </label>
      <label>
        Valor do documento
        <CurrencyInput disabled value={form.amount} onChange={() => undefined} />
      </label>
      <label>
        Valor recebido *
        <CurrencyInput
          required
          value={form.paidAmount}
          onChange={(value) => update("paidAmount", value)}
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
        <textarea
          placeholder="Informacoes adicionais sobre o recebimento"
          value={form.notes}
          onChange={(event) => update("notes", event.target.value)}
        />
      </label>
      {documents.length === 0 ? (
        <p className="info-message span-2">
          Nenhum {targetType === "quoteId" ? "orcamento" : "ordem de servico"} disponivel. Crie o
          documento antes de registrar o pagamento.
        </p>
      ) : null}
      {error ? <p className="form-error span-2">{error}</p> : null}
      {success ? <p className="success-message span-2">{success}</p> : null}
      <button className="button-primary" disabled={submitting || !form.targetId} type="submit">
        {submitting ? "Registrando..." : "Registrar pagamento"}
      </button>
    </form>
  );
}
