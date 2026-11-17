import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { CurrencyInput } from "../../../components/forms/CurrencyInput";
import { getApiErrorMessage } from "../../../lib/api/errors";
import { formatCurrency } from "../../../lib/formatters/currency";
import { itemTypeLabels } from "../../../lib/formatters/labels";
import { ClientPicker } from "../../clients/components/ClientPicker";
import { listCatalog, type CatalogResponse } from "../../quotes/api/quotes.api";
import { createWorkOrder, getWorkOrder, updateWorkOrder } from "../api/work-orders.api";
import { EquipmentFields, emptyEquipment } from "../components/EquipmentFields";

type WorkOrderDraftItem = {
  type: "SERVICE" | "PRODUCT";
  productId?: string;
  serviceId?: string;
  plannedQuantity: string;
  label: string;
  usedQuantity?: string;
  unitPrice?: string;
  unitCost?: string;
};

export function NewWorkOrderPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [loaded, setLoaded] = useState(!id);
  const [catalog, setCatalog] = useState<CatalogResponse>({ products: [], services: [] });
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState<WorkOrderDraftItem[]>([]);
  const [itemType, setItemType] = useState<WorkOrderDraftItem["type"]>("SERVICE");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [plannedQuantity, setPlannedQuantity] = useState("1.000");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    ...emptyEquipment,
    expectedAt: "",
    problemDescription: "",
    laborCost: "0.00",
    chargedAmount: "0.00",
    executionDescription: "",
    clientNotes: "",
    internalNotes: "",
  });

  useEffect(() => {
    listCatalog()
      .then(setCatalog)
      .catch(() => setCatalog({ products: [], services: [] }));
  }, []);

  useEffect(() => {
    if (!id) return;
    getWorkOrder(id)
      .then((order) => {
        if (["CONCLUIDA", "CANCELADA"].includes(order.status)) {
          navigate(`/ordens/${id}`);
          return;
        }
        setClientId(order.clientId);
        setForm({
          equipmentName: order.equipmentName ?? "",
          equipmentBrand: order.equipmentBrand ?? "",
          equipmentModel: order.equipmentModel ?? "",
          equipmentIdentifier: order.equipmentIdentifier ?? "",
          expectedAt: order.expectedAt?.slice(0, 10) ?? "",
          problemDescription: order.problemDescription,
          laborCost: String(order.laborCost ?? "0.00"),
          chargedAmount: String(order.chargedAmount),
          executionDescription: order.executionDescription ?? "",
          clientNotes: order.clientNotes ?? "",
          internalNotes: order.internalNotes ?? "",
        });
        setItems((order.items ?? []).map((item) => ({ ...item, label: item.descriptionSnapshot })));
        setLoaded(true);
      })
      .catch((caught) => setError(getApiErrorMessage(caught, "Nao foi possivel carregar a OS.")));
  }, [id, navigate]);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const input = {
        ...form,
        clientId,
        expectedAt: form.expectedAt || (id ? null : undefined),
        items,
      };
      const workOrder = id ? await updateWorkOrder(id, input) : await createWorkOrder(input);
      navigate(`/ordens/${workOrder.id}`);
    } catch (caught) {
      setError(getApiErrorMessage(caught, "Nao foi possivel criar a ordem de servico."));
    } finally {
      setSubmitting(false);
    }
  }

  const catalogOptions = itemType === "SERVICE" ? catalog.services : catalog.products;

  function addItem() {
    if (!selectedItemId) return;

    setItems((current) => [
      ...current,
      {
        type: itemType,
        productId: itemType === "PRODUCT" ? selectedItemId : undefined,
        serviceId: itemType === "SERVICE" ? selectedItemId : undefined,
        plannedQuantity,
        label: catalogOptions.find((item) => item.id === selectedItemId)?.name ?? "Item",
      },
    ]);
    setSelectedItemId("");
    setPlannedQuantity("1.000");
  }

  return (
    <section className="panel">
      <p className="eyebrow">Ordem de servico</p>
      <h2>{id ? "Editar OS" : "Criar OS diretamente"}</h2>
      <p>
        Cadastre o cliente ou a empresa destinataria e os dados do equipamento. Os itens podem ser
        preenchidos depois.
      </p>
      {!loaded && !error ? <p>Carregando...</p> : null}
      <form className="form-grid" onSubmit={submit}>
        <section className="form-step span-2">
          <div className="step-number">1</div>
          <div className="step-content form-grid embedded-form-grid">
            <div className="span-2">
              <h3>Cliente e prazo</h3>
              <p>Selecione para quem o servico sera executado.</p>
            </div>
            <fieldset disabled={Boolean(id)}>
              <ClientPicker
                value={clientId}
                onChange={(selected) => {
                  setClientId(selected);
                  setForm((current) => ({ ...current, ...emptyEquipment }));
                }}
              />
            </fieldset>
            <label>
              Data prevista
              <input
                type="date"
                value={form.expectedAt}
                onChange={(event) => update("expectedAt", event.target.value)}
              />
            </label>
          </div>
        </section>
        <label className="span-2">
          Descricao do problema *
          <textarea
            placeholder="Explique o servico solicitado ou o problema relatado"
            value={form.problemDescription}
            onChange={(event) => update("problemDescription", event.target.value)}
            required
          />
        </label>
        <EquipmentFields
          clientId={clientId}
          value={form}
          onChange={(equipment) => setForm((current) => ({ ...current, ...equipment }))}
        />
        <fieldset className="catalog-picker span-2">
          <legend>Itens previstos para a OS</legend>
          <div className="form-grid embedded-form-grid">
            <label>
              Tipo de item
              <select
                value={itemType}
                onChange={(event) => {
                  setItemType(event.target.value as WorkOrderDraftItem["type"]);
                  setSelectedItemId("");
                }}
              >
                <option value="SERVICE">{itemTypeLabels.SERVICE}</option>
                <option value="PRODUCT">{itemTypeLabels.PRODUCT}</option>
              </select>
            </label>
            <label>
              {itemType === "SERVICE" ? "Servico" : "Produto/peca"}
              <select
                value={selectedItemId}
                onChange={(event) => setSelectedItemId(event.target.value)}
              >
                <option value="">Selecione...</option>
                {catalogOptions.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} -{" "}
                    {formatCurrency("defaultPrice" in item ? item.defaultPrice : item.salePrice)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Quantidade prevista
              <input
                inputMode="decimal"
                value={plannedQuantity}
                onChange={(event) => setPlannedQuantity(event.target.value)}
              />
            </label>
            <button
              className="button-secondary align-end"
              disabled={!selectedItemId}
              type="button"
              onClick={addItem}
            >
              Adicionar item
            </button>
          </div>
          {items.length === 0 ? <p>Nenhum item previsto adicionado ainda.</p> : null}
          {items.map((item, index) => (
            <div className="table-row compact-row" key={`${item.type}-${index}`}>
              <strong>{item.label}</strong>
              <span>{itemTypeLabels[item.type]}</span>
              <span>Quantidade prevista: {item.plannedQuantity}</span>
              <button
                className="button-secondary"
                type="button"
                onClick={() =>
                  setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))
                }
              >
                Remover
              </button>
            </div>
          ))}
        </fieldset>
        <label>
          Custo de mao de obra
          <CurrencyInput value={form.laborCost} onChange={(value) => update("laborCost", value)} />
        </label>
        <label>
          Valor cobrado
          <CurrencyInput
            value={form.chargedAmount}
            onChange={(value) => update("chargedAmount", value)}
          />
        </label>
        {(
          [
            ["executionDescription", "Observacoes do servico"],
            ["clientNotes", "Observacoes do recebimento"],
            ["internalNotes", "Informacoes do tecnico"],
          ] as const
        ).map(([field, label]) => (
          <label key={field}>
            {label}
            <textarea value={form[field]} onChange={(event) => update(field, event.target.value)} />
          </label>
        ))}
        {error ? <p className="form-error span-2">{error}</p> : null}
        <button
          className="button-primary"
          disabled={!loaded || !clientId || submitting}
          type="submit"
        >
          {submitting ? "Salvando..." : id ? "Salvar alteracoes" : "Criar OS"}
        </button>
      </form>
    </section>
  );
}
