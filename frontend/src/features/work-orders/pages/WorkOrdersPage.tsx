import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { WorkOrder } from "../../../lib/api/schema";
import { formatCurrency } from "../../../lib/formatters/currency";
import { workOrderStatusLabels } from "../../../lib/formatters/labels";
import { listWorkOrders } from "../api/work-orders.api";

export function WorkOrdersPage() {
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>([]);

  useEffect(() => {
    listWorkOrders()
      .then(setWorkOrders)
      .catch(() => setWorkOrders([]));
  }, []);

  return (
    <section className="panel">
      <div className="page-header inline-header">
        <div>
          <p className="eyebrow">Ordens de servico</p>
          <h2>Execucao e acompanhamento</h2>
        </div>
        <Link className="button-primary" to="/ordens/nova">
          Nova OS
        </Link>
      </div>
      <div className="table-card">
        {workOrders.map((workOrder) => (
          <Link
            className="table-row work-order-row"
            key={workOrder.id}
            to={`/ordens/${workOrder.id}`}
          >
            <strong>{workOrder.number}</strong>
            <span>{workOrder.client?.name ?? "Cliente"}</span>
            <span>{workOrderStatusLabels[workOrder.status]}</span>
            <span>{formatCurrency(workOrder.chargedAmount)}</span>
          </Link>
        ))}
        {workOrders.length === 0 ? <p>Nenhuma ordem de servico cadastrada ainda.</p> : null}
      </div>
    </section>
  );
}
