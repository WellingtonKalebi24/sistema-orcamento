import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { getApiErrorMessage } from "../../../lib/api/errors";
import type { Quote } from "../../../lib/api/schema";
import { formatCurrency } from "../../../lib/formatters/currency";
import { quoteStatusLabels } from "../../../lib/formatters/labels";
import { downloadQuotePdf, getQuote, printQuotePdf } from "../api/quotes.api";
import { CreateWorkOrderAction } from "../components/CreateWorkOrderAction";
import { QuoteStatusActions } from "../components/QuoteStatusActions";

export function QuoteDetailPage() {
  const { id } = useParams();
  const [quote, setQuote] = useState<Quote>();
  const [pdfError, setPdfError] = useState("");
  const [pdfLoading, setPdfLoading] = useState<"download" | "print" | "">("");

  useEffect(() => {
    if (id) getQuote(id).then(setQuote);
  }, [id]);

  if (!quote) return <section className="panel">Carregando orcamento...</section>;

  async function handlePdf(action: "download" | "print") {
    setPdfError("");
    setPdfLoading(action);
    try {
      if (action === "download") await downloadQuotePdf(quote!.id, quote!.number);
      else await printQuotePdf(quote!.id);
    } catch (caught) {
      setPdfError(getApiErrorMessage(caught, "Nao foi possivel gerar o PDF."));
    } finally {
      setPdfLoading("");
    }
  }

  return (
    <section className="panel">
      <p className="eyebrow">Orcamento</p>
      <h2>
        {quote.number} - {quoteStatusLabels[quote.status]}
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
      {quote.status === "RASCUNHO" ? (
        <Link className="button-secondary inline-link" to={`/orcamentos/${quote.id}/editar`}>
          Editar orcamento
        </Link>
      ) : null}
      <QuoteStatusActions quote={quote} onChange={setQuote} />
      <CreateWorkOrderAction quote={quote} />
      {pdfError ? <p className="form-error">{pdfError}</p> : null}
      <div className="actions">
        <button
          className="button-primary"
          disabled={Boolean(pdfLoading)}
          type="button"
          onClick={() => void handlePdf("download")}
        >
          {pdfLoading === "download" ? "Gerando PDF..." : "Baixar PDF"}
        </button>
        <button
          className="button-secondary"
          disabled={Boolean(pdfLoading)}
          type="button"
          onClick={() => void handlePdf("print")}
        >
          {pdfLoading === "print" ? "Preparando..." : "Imprimir orcamento"}
        </button>
      </div>
    </section>
  );
}
