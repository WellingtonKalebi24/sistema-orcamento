import { useState } from "react";
import { useNavigate } from "react-router-dom";

import type { Quote } from "../../../lib/api/schema";
import { convertQuoteToWorkOrder } from "../../work-orders/api/work-orders.api";

export function CreateWorkOrderAction({ quote }: { quote: Quote }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (quote.status !== "APROVADO") return null;

  async function convert() {
    setLoading(true);
    setError("");
    try {
      const workOrder = await convertQuoteToWorkOrder(quote.id);
      navigate(`/ordens/${workOrder.id}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Nao foi possivel gerar a OS.");
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
