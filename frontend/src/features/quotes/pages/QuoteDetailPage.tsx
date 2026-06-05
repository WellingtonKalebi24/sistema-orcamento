import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import type { Quote } from "../../../lib/api/schema";
import { formatCurrency } from "../../../lib/formatters/currency";
import { getQuote, quotePdfUrl } from "../api/quotes.api";
import { QuoteStatusActions } from "../components/QuoteStatusActions";

export function QuoteDetailPage() {
  const { id } = useParams();
  const [quote, setQuote] = useState<Quote>();

  useEffect(() => {
    if (id) getQuote(id).then(setQuote);
  }, [id]);

  if (!quote) return <section className="panel">Carregando orcamento...</section>;

  return (
    <section className="panel">
      <p className="eyebrow">Orcamento</p>
      <h2>
        {quote.number} - {quote.status}
      </h2>
      <p>{quote.client?.name}</p>
      <p>{quote.requestDescription}</p>
      <div className="table-card">
        {quote.items?.map((item) => (
          <p key={item.id}>
            {item.descriptionSnapshot}: {item.quantity} x {formatCurrency(item.unitPrice)} ={" "}
            {formatCurrency(item.total)}
          </p>
        ))}
      </div>
      <h3>Total: {formatCurrency(quote.totalAmount)}</h3>
      <QuoteStatusActions quote={quote} onChange={setQuote} />
      <a
        className="button-primary inline-link"
        href={quotePdfUrl(quote.id)}
        rel="noreferrer"
        target="_blank"
      >
        Baixar PDF
      </a>
    </section>
  );
}
