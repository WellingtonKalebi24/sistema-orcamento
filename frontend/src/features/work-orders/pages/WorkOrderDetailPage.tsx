import { DocumentActions } from "../../../components/DocumentActions";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import type { WorkOrder } from "../../../lib/api/schema";
import { formatCurrency } from "../../../lib/formatters/currency";
import { workOrderStatusLabels } from "../../../lib/formatters/labels";
import { AttachmentPanel } from "../components/AttachmentPanel";
import { ExecutionForm } from "../components/ExecutionForm";
import { WorkOrderStatusPanel } from "../components/WorkOrderStatusPanel";
import { downloadWorkOrderPdf, printWorkOrderPdf, getWorkOrder } from "../api/work-orders.api";
import { EquipmentPanel } from "../components/EquipmentPanel";

export function WorkOrderDetailPage() {
  const { id } = useParams();
  const [workOrder, setWorkOrder] = useState<WorkOrder>();
  const [downloading, setDownloading] = useState(false);
  const [pdfError, setPdfError] = useState("");

  async function downloadPdf(print = false) {
    if (!workOrder) return;
    setDownloading(true);
    setPdfError("");
    try {
      if (print) await printWorkOrderPdf(workOrder.id);
      else await downloadWorkOrderPdf(workOrder.id, workOrder.number);
    } catch {
      setPdfError("Não foi possível baixar o PDF da ordem de serviço. Tente novamente.");
    } finally {
      setDownloading(false);
    }
  }

  useEffect(() => {
    if (id) getWorkOrder(id).then(setWorkOrder);
  }, [id]);

  if (!workOrder) return <section className="panel">Carregando ordem de servico...</section>;

  return (
    <section className="panel">
      <p className="eyebrow">Ordem de servico</p>
      <h2>
        {workOrder.number} - {workOrderStatusLabels[workOrder.status]}
      </h2>
      <p>{workOrder.client?.name}</p>
      <p>{workOrder.problemDescription}</p>
      <button
        type="button"
        className="button-primary"
        disabled={downloading}
        onClick={() => void downloadPdf()}
      >
        {downloading ? "Gerando PDF..." : "Baixar PDF"}
      </button>
      <button
        type="button"
        className="button-secondary"
        disabled={downloading}
        onClick={() => void downloadPdf(true)}
      >
        Imprimir OS
      </button>
      {!["CONCLUIDA", "CANCELADA"].includes(workOrder.status) ? (
        <Link className="button-secondary inline-link" to={`/ordens/${workOrder.id}/editar`}>
          Editar OS
        </Link>
      ) : null}
      <DocumentActions
        kind="work-orders"
        id={workOrder.id}
        number={workOrder.number}
        phone={workOrder.client?.whatsapp || workOrder.client?.phone}
      />
      {pdfError ? (
        <p role="alert" className="form-error">
          {pdfError}
        </p>
      ) : null}
      <EquipmentPanel key={workOrder.id} workOrder={workOrder} onChange={setWorkOrder} />
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
