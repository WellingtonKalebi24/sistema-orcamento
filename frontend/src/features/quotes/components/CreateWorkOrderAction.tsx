import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getApiErrorMessage } from "../../../lib/api/errors";
import type { Quote } from "../../../lib/api/schema";
import { convertQuoteToWorkOrder } from "../../work-orders/api/work-orders.api";

export function CreateWorkOrderAction({ quote }: { quote: Quote }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (quote.status !== "APROVADO") return null;

  if (quote.workOrder) {
    return (
      <div className="success-message">
        <strong>Ordem de servico ja criada</strong>
        <p>
          Este orcamento gerou a OS <strong>{quote.workOrder.number}</strong>.
        </p>
        <Link className="button-secondary inline-link" to={`/ordens/${quote.workOrder.id}`}>
          Abrir ordem de servico
        </Link>
      </div>
    );
  }

  async function convert() {
    setLoading(true);
    setError("");
    try {
      const workOrder = await convertQuoteToWorkOrder(quote.id);
      navigate(`/ordens/${workOrder.id}`);
    } catch (caught) {
      setError(getApiErrorMessage(caught, "Nao foi possivel gerar a OS."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="table-card">
      <strong>Orcamento aprovado</strong>
      <p>Gere a ordem de servico para iniciar a execucao e controlar estoque.</p>
      {error ? <p className="form-error">{error}</p> : null}
      <button
        className="button-primary inline-link"
        disabled={loading}
        type="button"
        onClick={convert}
      >
        Gerar ordem de servico
      </button>
    </div>
  );
}
