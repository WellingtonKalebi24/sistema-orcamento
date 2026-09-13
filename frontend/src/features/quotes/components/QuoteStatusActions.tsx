import { useState } from "react";
import { getApiErrorMessage } from "../../../lib/api/errors";
import type { Quote, QuoteStatus } from "../../../lib/api/schema";
import { quoteStatusLabels } from "../../../lib/formatters/labels";
import { changeQuoteStatus } from "../api/quotes.api";

const actions: Record<QuoteStatus, QuoteStatus[]> = {
  RASCUNHO: ["ENVIADO", "RECUSADO"],
  ENVIADO: ["APROVADO", "RECUSADO", "EXPIRADO"],
  APROVADO: [],
  RECUSADO: [],
  EXPIRADO: [],
};

export function QuoteStatusActions({
  quote,
  onChange,
}: {
  quote: Quote;
  onChange: (quote: Quote) => void;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function handleChange(status: QuoteStatus) {
    setPending(true);
    setError("");
    try {
      onChange(await changeQuoteStatus(quote.id, status));
    } catch (caught) {
      setError(getApiErrorMessage(caught, "Nao foi possivel atualizar o orcamento."));
    } finally {
      setPending(false);
    }
  }
  return (
    <div className="actions">
      {error ? <p className="form-error" role="alert">{error}</p> : null}
      {actions[quote.status].map((status) => (
        <button
          className="button-secondary"
          key={status}
          type="button"
          disabled={pending}
          onClick={() => void handleChange(status)}
        >
          {quoteStatusLabels[status]}
        </button>
      ))}
    </div>
  );
}
