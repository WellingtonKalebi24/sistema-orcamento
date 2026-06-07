import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { ClientPicker } from "../../clients/components/ClientPicker";
import { listCatalog, type CatalogResponse } from "../../quotes/api/quotes.api";
import { createWorkOrder } from "../api/work-orders.api";

export function NewWorkOrderPage() {
  const navigate = useNavigate();
  const [catalog, setCatalog] = useState<CatalogResponse>({ products: [], services: [] });
  const [clientId, setClientId] = useState("");
  const [items, setItems] = useState<
    Array<{
      type: "SERVICE" | "PRODUCT";
      productId?: string;
      serviceId?: string;
      plannedQuantity: string;
    }>
  >([]);
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
    const workOrder = await createWorkOrder({
      ...form,
      clientId,
      expectedAt: form.expectedAt || undefined,
      items,
    });
    navigate(`/ordens/${workOrder.id}`);
  }

  return (
    <section className="panel">
      <p className="eyebrow">Nova OS</p>
      <h2>Criar ordem de servico manual</h2>
      <form className="form-grid" onSubmit={submit}>
        <ClientPicker value={clientId} onChange={setClientId} />
        <label>
          Data prevista
          <input
            type="date"
            value={form.expectedAt}
            onChange={(event) => update("expectedAt", event.target.value)}
          />
        </label>
        <label className="span-2">
          Descricao do problema
          <textarea
            value={form.problemDescription}
            onChange={(event) => update("problemDescription", event.target.value)}
            required
          />
        </label>
        <div className="catalog-picker span-2">
          <button
            className="button-secondary"
            type="button"
            onClick={() => {
              const service = catalog.services[0];
              if (service)
                setItems((current) => [
                  ...current,
                  { type: "SERVICE", serviceId: service.id, plannedQuantity: "1.000" },
                ]);
            }}
          >
            Adicionar servico do catalogo
          </button>
          <button
            className="button-secondary"
            type="button"
            onClick={() => {
              const product = catalog.products[0];
              if (product)
                setItems((current) => [
                  ...current,
                  { type: "PRODUCT", productId: product.id, plannedQuantity: "1.000" },
                ]);
            }}
          >
            Adicionar produto do catalogo
          </button>
          <small>{items.length} item(ns) adicionados.</small>
        </div>
        <label>
          Custo de mao de obra
          <input
            value={form.laborCost}
            onChange={(event) => update("laborCost", event.target.value)}
          />
        </label>
        <label>
          Valor cobrado
          <input
            value={form.chargedAmount}
            onChange={(event) => update("chargedAmount", event.target.value)}
          />
        </label>
        <button className="button-primary" disabled={!clientId || items.length === 0} type="submit">
          Criar OS
        </button>
      </form>
    </section>
  );
}
