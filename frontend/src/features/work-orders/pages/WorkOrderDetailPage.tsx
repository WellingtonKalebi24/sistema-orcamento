import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import type { WorkOrder } from "../../../lib/api/schema";
import { formatCurrency } from "../../../lib/formatters/currency";
import { AttachmentPanel } from "../components/AttachmentPanel";
import { ExecutionForm } from "../components/ExecutionForm";
import { WorkOrderStatusPanel } from "../components/WorkOrderStatusPanel";
import { getWorkOrder } from "../api/work-orders.api";

export function WorkOrderDetailPage() {
  const { id } = useParams();
  const [workOrder, setWorkOrder] = useState<WorkOrder>();

  useEffect(() => {
    if (id) getWorkOrder(id).then(setWorkOrder);
  }, [id]);

  if (!workOrder) return <section className="panel">Carregando ordem de servico...</section>;

  return (
    <section className="panel">
      <p className="eyebrow">Ordem de servico</p>
      <h2>
        {workOrder.number} - {workOrder.status}
      </h2>
      <p>{workOrder.client?.name}</p>
      <p>{workOrder.problemDescription}</p>
      <div className="panels detail-panels">
        <div className="table-card">
          <strong>Itens executados</strong>
          {workOrder.items?.map((item) => (
            <p key={item.id}>
              {item.descriptionSnapshot}: planejado {item.plannedQuantity}, usado{" "}
              {item.usedQuantity}
            </p>
          ))}
        </div>
        <div className="table-card">
          <strong>Financeiro da OS</strong>
          <p>Cobrado: {formatCurrency(workOrder.chargedAmount)}</p>
          <p>Custo: {formatCurrency(workOrder.totalCost)}</p>
          <p>Lucro estimado: {formatCurrency(workOrder.estimatedProfit)}</p>
        </div>
      </div>
      <WorkOrderStatusPanel workOrder={workOrder} onChange={setWorkOrder} />
      <ExecutionForm workOrder={workOrder} onChange={setWorkOrder} />
      <AttachmentPanel workOrderId={workOrder.id} />
    </section>
  );
}
