import type { Quote, QuoteStatus } from "../../../lib/api/schema";
import { quoteStatusLabels } from "../../../lib/formatters/labels";
import { changeQuoteStatus } from "../api/quotes.api";

const actions: QuoteStatus[] = ["ENVIADO", "APROVADO", "RECUSADO", "EXPIRADO"];

export function QuoteStatusActions({
  quote,
  onChange,
}: {
  quote: Quote;
  onChange: (quote: Quote) => void;
}) {
  return (
    <div className="actions">
      {actions.map((status) => (
        <button
          className="button-secondary"
          key={status}
          type="button"
          onClick={() => changeQuoteStatus(quote.id, status).then(onChange)}
        >
          {quoteStatusLabels[status]}
        </button>
      ))}
    </div>
  );
}
