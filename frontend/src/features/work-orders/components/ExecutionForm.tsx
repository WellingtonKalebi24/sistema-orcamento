import { useState } from "react";

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

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    try {
      onChange(
        await completeWorkOrder(workOrder.id, { executionDescription, clientNotes, internalNotes }),
      );
    } catch (caught) {
      const fallback = caught instanceof Error ? caught.message : "Nao foi possivel concluir a OS.";
      setError(fallback);
    }
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
      <button className="button-primary" disabled={workOrder.status === "CONCLUIDA"} type="submit">
        Concluir OS e baixar estoque
      </button>
    </form>
  );
}
