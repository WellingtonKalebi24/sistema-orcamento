import type { WorkOrder, WorkOrderStatus } from "../../../lib/api/schema";
import { workOrderStatusLabels } from "../../../lib/formatters/labels";
import { updateWorkOrder } from "../api/work-orders.api";

const statuses: WorkOrderStatus[] = ["EM_ANDAMENTO", "AGUARDANDO_PECA", "CANCELADA"];

export function WorkOrderStatusPanel({
  workOrder,
  onChange,
}: {
  workOrder: WorkOrder;
  onChange: (workOrder: WorkOrder) => void;
}) {
  const isFinal = workOrder.status === "CONCLUIDA" || workOrder.status === "CANCELADA";

  return (
    <div className="table-card">
      <strong>Status da OS: {workOrderStatusLabels[workOrder.status]}</strong>
      {isFinal ? (
        <p>Esta ordem esta finalizada e nao permite novas mudancas de status.</p>
      ) : (
        <div className="actions compact-actions">
          {statuses.map((status) => (
            <button
              className="button-secondary"
              key={status}
              type="button"
              onClick={() => updateWorkOrder(workOrder.id, { status }).then(onChange)}
            >
              {workOrderStatusLabels[status]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
