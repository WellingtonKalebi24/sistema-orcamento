import { useState } from "react";
import type { WorkOrder } from "../../../lib/api/schema";
import { getApiErrorMessage } from "../../../lib/api/errors";
import { updateWorkOrder } from "../api/work-orders.api";
import { EquipmentFields, emptyEquipment } from "./EquipmentFields";

export function EquipmentPanel({ workOrder, onChange }: { workOrder: WorkOrder; onChange: (order: WorkOrder) => void }) {
  const [value, setValue] = useState({
    equipmentName: workOrder.equipmentName ?? "",
    equipmentBrand: workOrder.equipmentBrand ?? "",
    equipmentModel: workOrder.equipmentModel ?? "",
    equipmentIdentifier: workOrder.equipmentIdentifier ?? "",
  } satisfies typeof emptyEquipment);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const locked = ["CONCLUIDA", "CANCELADA"].includes(workOrder.status);
  return <form className="form-grid" onSubmit={async (event) => {
    event.preventDefault(); setSaving(true); setError("");
    try { onChange(await updateWorkOrder(workOrder.id, value)); }
    catch (caught) { setError(getApiErrorMessage(caught, "Nao foi possivel salvar o equipamento.")); }
    finally { setSaving(false); }
  }}>
    <EquipmentFields clientId={workOrder.clientId} value={value} onChange={setValue} disabled={locked || saving} />
    {error && <p role="alert" className="form-error">{error}</p>}
    {!locked && <button type="submit" className="button-secondary" disabled={saving}>{saving ? "Salvando..." : "Salvar equipamento"}</button>}
  </form>;
}
