import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { Quote } from "../../../lib/api/schema";
import { formatCurrency } from "../../../lib/formatters/currency";
import { quoteStatusLabels } from "../../../lib/formatters/labels";
import { listQuotes } from "../api/quotes.api";

export function QuotesPage() {
  const [quotes, setQuotes] = useState<Quote[]>([]);

  useEffect(() => {
    listQuotes()
      .then(setQuotes)
      .catch(() => setQuotes([]));
  }, []);

  return (
    <section className="panel">
      <p className="eyebrow">Orcamentos</p>
      <h2>Ultimos orcamentos</h2>
      <div className="table-card">
        {quotes.map((quote) => (
          <Link className="table-row" key={quote.id} to={`/orcamentos/${quote.id}`}>
            <span>{quote.number}</span>
            <span>{quote.client?.name}</span>
            <span>{quoteStatusLabels[quote.status]}</span>
            <strong>{formatCurrency(quote.totalAmount)}</strong>
          </Link>
        ))}
        {quotes.length === 0 ? <p>Nenhum orcamento encontrado.</p> : null}
      </div>
    </section>
  );
}
