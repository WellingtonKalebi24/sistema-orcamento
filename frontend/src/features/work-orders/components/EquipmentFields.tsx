import { useEffect, useState } from "react";
import { getClientHistory, type ClientHistory } from "../../clients/api/clients.api";

export const emptyEquipment = {
  equipmentName: "",
  equipmentBrand: "",
  equipmentModel: "",
  equipmentIdentifier: "",
};

export function EquipmentFields({ value, onChange, disabled = false, clientId }: {
  value: Partial<typeof emptyEquipment>;
  onChange: (value: typeof emptyEquipment) => void;
  disabled?: boolean;
  clientId?: string;
}) {
  const [equipment, setEquipment] = useState<ClientHistory["equipmentHistory"]>([]);
  const [loadError, setLoadError] = useState(false);
  useEffect(() => {
    let active = true;
    setEquipment([]); setLoadError(false);
    if (clientId) getClientHistory(clientId).then((history) => { if (active) setEquipment(history.equipmentHistory ?? []); })
      .catch(() => { if (active) setLoadError(true); });
    return () => { active = false; };
  }, [clientId]);
  const labels = { equipmentName: "Equipamento", equipmentBrand: "Marca", equipmentModel: "Modelo", equipmentIdentifier: "Numero de serie ou codigo interno" };
  return <fieldset className="span-2 form-grid" disabled={disabled}>
    <legend>Equipamento do cliente</legend>
    <p className="span-2">Use a mesma identificacao em cada retorno deste equipamento. Para aparelhos sem numero de serie, atribua um codigo interno unico por cliente.</p>
    {loadError && <p role="alert">Nao foi possivel consultar equipamentos anteriores. Voce pode preencher os campos manualmente.</p>}
    {equipment.length > 0 && <label className="span-2">Equipamento ja atendido
      <select value="" onChange={(event) => {
        const selected = equipment.find((item) => item.identifier === event.target.value);
        if (selected) onChange({ equipmentName: selected.name, equipmentBrand: selected.brand, equipmentModel: selected.model, equipmentIdentifier: selected.identifier });
      }}><option value="">Selecione para preencher ou cadastre abaixo</option>
        {equipment.map((item) => <option key={item.identifier} value={item.identifier}>{item.name} - {item.identifier} ({item.completed} manutencoes concluidas)</option>)}
      </select></label>}
    {Object.entries(labels).map(([key, label]) => <label key={key}>{label}
      <input maxLength={key === "equipmentName" ? 200 : 100} value={value[key as keyof typeof emptyEquipment] ?? ""}
        onChange={(event) => onChange({ ...emptyEquipment, ...value, [key]: event.target.value })} />
    </label>)}
  </fieldset>;
}
