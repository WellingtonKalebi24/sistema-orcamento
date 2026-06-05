import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { ClientPicker } from "../../clients/components/ClientPicker";
import { createQuote } from "../api/quotes.api";
import { CatalogItemPicker, type QuoteFormItem } from "./CatalogItemPicker";

function defaultValidUntil() {
  return new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
}

export function QuoteForm() {
  const navigate = useNavigate();
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState<QuoteFormItem[]>([]);
  const [form, setForm] = useState(() => ({
    validUntil: defaultValidUntil(),
    requestDescription: "",
    laborAmount: "0.00",
    travelFee: "0.00",
    generalDiscount: "0.00",
    paymentTerms: "50% na aprovacao e 50% na entrega",
    executionDeadline: "A combinar",
    notes: "",
  }));

  function update(field: string, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const quote = await createQuote({ ...form, clientId, items });
    navigate(`/orcamentos/${quote.id}`);
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <ClientPicker value={clientId} onChange={setClientId} />
      <label>
        Validade
        <input
          type="date"
          value={form.validUntil}
          onChange={(event) => update("validUntil", event.target.value)}
          required
        />
      </label>
      <label className="span-2">
        Descricao do problema ou solicitacao
        <textarea
          value={form.requestDescription}
          onChange={(event) => update("requestDescription", event.target.value)}
          required
        />
      </label>
      <CatalogItemPicker onAdd={(item) => setItems((current) => [...current, item])} />
      <div className="span-2 table-card">
        <strong>Itens do orcamento</strong>
        {items.map((item, index) => (
          <p key={`${item.type}-${index}`}>
            {item.type} - quantidade {item.quantity} - valor {item.unitPrice}
          </p>
        ))}
      </div>
      <label>
        Mao de obra
        <input
          value={form.laborAmount}
          onChange={(event) => update("laborAmount", event.target.value)}
        />
      </label>
      <label>
        Deslocamento
        <input
          value={form.travelFee}
          onChange={(event) => update("travelFee", event.target.value)}
        />
      </label>
      <label>
        Desconto geral
        <input
          value={form.generalDiscount}
          onChange={(event) => update("generalDiscount", event.target.value)}
        />
      </label>
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
      <button className="button-primary" type="submit" disabled={!clientId || items.length === 0}>
        Criar orcamento
      </button>
    </form>
  );
}
