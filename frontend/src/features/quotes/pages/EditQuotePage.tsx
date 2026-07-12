import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";

import type { Quote } from "../../../lib/api/schema";
import { getQuote } from "../api/quotes.api";
import { QuoteForm } from "../components/QuoteForm";

export function EditQuotePage() {
  const { id } = useParams();
  const [quote, setQuote] = useState<Quote>();

  useEffect(() => {
    if (id) getQuote(id).then(setQuote);
  }, [id]);

  if (!id) return <Navigate replace to="/orcamentos" />;
  if (!quote) return <section className="panel">Carregando orcamento...</section>;
  if (quote.status !== "RASCUNHO") return <Navigate replace to={`/orcamentos/${quote.id}`} />;

  return (
    <section className="panel">
      <p className="eyebrow">Orcamentos</p>
      <h2>Editar {quote.number}</h2>
      <QuoteForm quote={quote} />
    </section>
  );
}
