import { useState } from "react";

import { getApiErrorMessage } from "../../../lib/api/errors";
import type { WorkOrder } from "../../../lib/api/schema";
import { completeWorkOrder } from "../api/work-orders.api";

export function ExecutionForm({
  workOrder,
  onChange,
}: {
  workOrder: WorkOrder;
  onChange: (workOrder: WorkOrder) => void;
}) {
  const [executionDescription, setExecutionDescription] = useState(
    workOrder.executionDescription ?? "",
  );
  const [clientNotes, setClientNotes] = useState(workOrder.clientNotes ?? "");
  const [internalNotes, setInternalNotes] = useState(workOrder.internalNotes ?? "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      onChange(
        await completeWorkOrder(workOrder.id, { executionDescription, clientNotes, internalNotes }),
      );
    } catch (caught) {
      setError(getApiErrorMessage(caught, "Nao foi possivel concluir a OS."));
    } finally {
      setSubmitting(false);
    }
  }

  if (workOrder.status === "CONCLUIDA") {
    return (
      <div className="success-message completion-message">
        <strong>Ordem de servico concluida com sucesso</strong>
        <p>A baixa das pecas utilizadas ja foi registrada no estoque.</p>
      </div>
    );
  }

  if (workOrder.status === "CANCELADA") {
    return (
      <div className="info-message">Esta ordem foi cancelada e nao pode mais ser concluida.</div>
    );
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label className="span-2">
        Descricao da execucao
        <textarea
          value={executionDescription}
          onChange={(event) => setExecutionDescription(event.target.value)}
        />
      </label>
      <label>
        Observacoes para o cliente
        <textarea value={clientNotes} onChange={(event) => setClientNotes(event.target.value)} />
      </label>
      <label>
        Observacoes internas
        <textarea
          value={internalNotes}
          onChange={(event) => setInternalNotes(event.target.value)}
        />
      </label>
      {error ? <p className="form-error span-2">{error}</p> : null}
      <button className="button-primary" disabled={submitting} type="submit">
        {submitting ? "Concluindo..." : "Concluir OS e baixar estoque"}
      </button>
    </form>
  );
}
