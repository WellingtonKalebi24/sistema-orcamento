import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { CurrencyInput } from "../../../components/forms/CurrencyInput";
import { getApiErrorMessage } from "../../../lib/api/errors";
import { formatCurrency } from "../../../lib/formatters/currency";
import { itemTypeLabels } from "../../../lib/formatters/labels";
import { ClientPicker } from "../../clients/components/ClientPicker";
import { listCatalog, type CatalogResponse } from "../../quotes/api/quotes.api";
import { createWorkOrder } from "../api/work-orders.api";

type WorkOrderDraftItem = {
  type: "SERVICE" | "PRODUCT";
  productId?: string;
  serviceId?: string;
  plannedQuantity: string;
  label: string;
};

export function NewWorkOrderPage() {
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState<CatalogResponse>({ products: [], services: [] });
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState<WorkOrderDraftItem[]>([]);
  const [itemType, setItemType] = useState<WorkOrderDraftItem["type"]>("SERVICE");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [plannedQuantity, setPlannedQuantity] = useState("1.000");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    expectedAt: "",
    problemDescription: "",
    laborCost: "0.00",
    chargedAmount: "0.00",
  });

  useEffect(() => {
    listCatalog()
      .then(setCatalog)
      .catch(() => setCatalog({ products: [], services: [] }));
  }, []);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const workOrder = await createWorkOrder({
        ...form,
        clientId,
        expectedAt: form.expectedAt || undefined,
        items,
      });
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
      <p className="eyebrow">Nova OS</p>
      <h2>Criar ordem de servico manual</h2>
      <div className="info-message flow-hint">
        <strong>Fluxo recomendado:</strong> crie um orcamento, marque como aprovado e use o botao
        “Gerar ordem de servico”. Use esta tela somente quando nao houver orcamento previo.
        <Link className="button-link" to="/orcamentos/novo">
          Criar orcamento
        </Link>
      </div>
      <form className="form-grid" onSubmit={submit}>
        <section className="form-step span-2">
          <div className="step-number">1</div>
          <div className="step-content form-grid embedded-form-grid">
            <div className="span-2">
              <h3>Cliente e prazo</h3>
              <p>Selecione para quem o servico sera executado.</p>
            </div>
            <ClientPicker value={clientId} onChange={setClientId} />
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
        {error ? <p className="form-error span-2">{error}</p> : null}
        <button
          className="button-primary"
          disabled={!clientId || items.length === 0 || submitting}
          type="submit"
        >
          {submitting ? "Criando..." : "Criar OS"}
        </button>
      </form>
    </section>
  );
}
