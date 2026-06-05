import { changeQuoteStatus } from "../api/quotes.api";
import type { Quote, QuoteStatus } from "../../../lib/api/schema";

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
          {status}
        </button>
      ))}
    </div>
  );
}
