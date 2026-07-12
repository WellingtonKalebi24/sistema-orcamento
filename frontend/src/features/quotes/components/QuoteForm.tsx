import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { CurrencyInput } from "../../../components/forms/CurrencyInput";
import { getApiErrorMessage } from "../../../lib/api/errors";
import type { Quote } from "../../../lib/api/schema";
import { formatCurrency } from "../../../lib/formatters/currency";
import { itemTypeLabels } from "../../../lib/formatters/labels";
import { ClientPicker } from "../../clients/components/ClientPicker";
import { createQuote, updateQuote } from "../api/quotes.api";
import { CatalogItemPicker, type QuoteFormItem } from "./CatalogItemPicker";

function defaultValidUntil() {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function QuoteForm({ quote }: { quote?: Quote }) {
  const navigate = useNavigate();
  const [clientId, setClientId] = useState(quote?.clientId ?? "");
  const [items, setItems] = useState<QuoteFormItem[]>(
    quote?.items?.map((item) => ({
      type: item.type,
      productId: item.productId,
      serviceId: item.serviceId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discountAmount: item.discountAmount,
      label: item.descriptionSnapshot,
    })) ?? [],
  );
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState(() => ({
    validUntil: quote?.validUntil
      ? new Date(quote.validUntil).toISOString().slice(0, 10)
      : defaultValidUntil(),
    requestDescription: quote?.requestDescription ?? "",
    laborAmount: quote?.laborAmount ?? "0.00",
    travelFee: quote?.travelFee ?? "0.00",
    generalDiscount: quote?.generalDiscount ?? "0.00",
    paymentTerms: quote?.paymentTerms ?? "50% na aprovacao e 50% na entrega",
    executionDeadline: quote?.executionDeadline ?? "A combinar",
    notes: quote?.notes ?? "",
  }));

  function update(field: string, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const savedQuote = quote
        ? await updateQuote(quote.id, { ...form, clientId, items })
        : await createQuote({ ...form, clientId, items });
      navigate(`/orcamentos/${savedQuote.id}`);
    } catch (caught) {
      setError(getApiErrorMessage(caught, "Nao foi possivel criar o orcamento."));
    } finally {
      setSubmitting(false);
    }
  }

  const itemsTotal = items.reduce(
    (total, item) =>
      total + Number(item.quantity) * Number(item.unitPrice) - Number(item.discountAmount),
    0,
  );
  const quoteTotal = Math.max(
    0,
    itemsTotal + Number(form.laborAmount) + Number(form.travelFee) - Number(form.generalDiscount),
  );

  return (
    <form className="form-grid" onSubmit={submit}>
      <section className="form-step span-2">
        <div className="step-number">1</div>
        <div className="step-content form-grid embedded-form-grid">
          <div className="span-2">
            <h3>Quem vai receber o orcamento?</h3>
            <p>Busque um cliente existente ou cadastre um novo.</p>
          </div>
          <ClientPicker value={clientId} onChange={setClientId} />
          <label>
            Validade do orcamento *
            <input
              type="date"
              value={form.validUntil}
              onChange={(event) => update("validUntil", event.target.value)}
              required
            />
          </label>
        </div>
      </section>
      <section className="form-step span-2">
        <div className="step-number">2</div>
        <div className="step-content">
          <h3>O que o cliente precisa?</h3>
          <p>Escreva de forma simples o problema ou servico solicitado.</p>
          <label>
            Solicitacao *
            <textarea
              placeholder="Ex.: Computador lento, precisa de diagnostico e troca do SSD"
              value={form.requestDescription}
              onChange={(event) => update("requestDescription", event.target.value)}
              required
            />
          </label>
        </div>
      </section>
      <CatalogItemPicker onAdd={(item) => setItems((current) => [...current, item])} />
      <div className="span-2 table-card">
        <strong>Itens do orcamento</strong>
        {items.length === 0 ? <p>Nenhum item adicionado ainda.</p> : null}
        {items.map((item, index) => (
          <div className="table-row compact-row" key={`${item.type}-${index}`}>
            <strong>{item.label}</strong>
            <span>{itemTypeLabels[item.type]}</span>
            <span>Quantidade: {item.quantity}</span>
            <span>Valor unitario: {formatCurrency(item.unitPrice)}</span>
            <span>Desconto: {formatCurrency(item.discountAmount)}</span>
            <button
              className="button-secondary"
              type="button"
              onClick={() =>
                setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))
              }
            >
              Remover
            </button>
          </div>
        ))}
      </div>
      <label>
        Mao de obra
        <CurrencyInput
          value={form.laborAmount}
          onChange={(value) => update("laborAmount", value)}
        />
      </label>
      <label>
        Deslocamento
        <CurrencyInput value={form.travelFee} onChange={(value) => update("travelFee", value)} />
      </label>
      <label>
        Desconto geral
        <CurrencyInput
          value={form.generalDiscount}
          onChange={(value) => update("generalDiscount", value)}
        />
      </label>
      <div className="quote-total-card">
        <span>Total estimado</span>
        <strong>{formatCurrency(quoteTotal)}</strong>
      </div>
      <label>
        Condicoes de pagamento
        <input
          value={form.paymentTerms}
          onChange={(event) => update("paymentTerms", event.target.value)}
        />
      </label>
      <label>
        Prazo de execucao
        <input
          value={form.executionDeadline}
          onChange={(event) => update("executionDeadline", event.target.value)}
        />
      </label>
      <label className="span-2">
        Observacoes
        <textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} />
      </label>
      {error ? <p className="form-error span-2">{error}</p> : null}
      <button
        className="button-primary"
        type="submit"
        disabled={!clientId || items.length === 0 || submitting}
      >
        {submitting
          ? quote
            ? "Salvando..."
            : "Criando..."
          : quote
            ? "Salvar alteracoes"
            : "Criar orcamento"}
      </button>
    </form>
  );
}
