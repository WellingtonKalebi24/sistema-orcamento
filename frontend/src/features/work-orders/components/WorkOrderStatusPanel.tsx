import type { WorkOrder, WorkOrderStatus } from "../../../lib/api/schema";
import { updateWorkOrder } from "../api/work-orders.api";

const statuses: WorkOrderStatus[] = ["EM_ANDAMENTO", "AGUARDANDO_PECA", "CANCELADA"];

export function WorkOrderStatusPanel({
  workOrder,
  onChange,
}: {
  workOrder: WorkOrder;
  onChange: (workOrder: WorkOrder) => void;
}) {
  return (
    <div className="table-card">
      <strong>Status da OS: {workOrder.status}</strong>
      <div className="actions compact-actions">
        {statuses.map((status) => (
          <button
            className="button-secondary"
            key={status}
            type="button"
            disabled={workOrder.status === "CONCLUIDA" || workOrder.status === "CANCELADA"}
            onClick={() => updateWorkOrder(workOrder.id, { status }).then(onChange)}
          >
            {status}
          </button>
        ))}
      </div>
    </div>
  );
}
