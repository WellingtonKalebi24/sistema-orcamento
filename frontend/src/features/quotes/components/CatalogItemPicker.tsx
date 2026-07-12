import { useEffect, useState } from "react";

import { CurrencyInput } from "../../../components/forms/CurrencyInput";
import { formatCurrency } from "../../../lib/formatters/currency";
import { itemTypeLabels } from "../../../lib/formatters/labels";
import { listCatalog, type CatalogResponse } from "../api/quotes.api";

export type QuoteFormItem = {
  type: "SERVICE" | "PRODUCT";
  productId?: string;
  serviceId?: string;
  quantity: string;
  unitPrice: string;
  discountAmount: string;
  label: string;
};

export function CatalogItemPicker({ onAdd }: { onAdd: (item: QuoteFormItem) => void }) {
  const [catalog, setCatalog] = useState<CatalogResponse>({ products: [], services: [] });
  const [type, setType] = useState<QuoteFormItem["type"]>("SERVICE");
  const [selectedId, setSelectedId] = useState("");
  const [quantity, setQuantity] = useState("1.000");
  const [unitPrice, setUnitPrice] = useState("0.00");
  const [discountAmount, setDiscountAmount] = useState("0.00");

  useEffect(() => {
    listCatalog()
      .then(setCatalog)
      .catch(() => setCatalog({ products: [], services: [] }));
  }, []);

  const options = type === "SERVICE" ? catalog.services : catalog.products;

  function changeType(nextType: QuoteFormItem["type"]) {
    setType(nextType);
    setSelectedId("");
    setUnitPrice("0.00");
  }

  function selectItem(nextId: string) {
    setSelectedId(nextId);
    if (type === "SERVICE") {
      const service = catalog.services.find((option) => option.id === nextId);
      if (service) setUnitPrice(service.defaultPrice);
      return;
    }

    const product = catalog.products.find((option) => option.id === nextId);
    if (product) setUnitPrice(product.salePrice);
  }

  function addItem() {
    if (!selectedId) return;

    onAdd({
      type,
      productId: type === "PRODUCT" ? selectedId : undefined,
      serviceId: type === "SERVICE" ? selectedId : undefined,
      quantity,
      unitPrice,
      discountAmount,
      label: options.find((option) => option.id === selectedId)?.name ?? "Item",
    });

    setSelectedId("");
    setQuantity("1.000");
    setUnitPrice("0.00");
    setDiscountAmount("0.00");
  }

  return (
    <fieldset className="catalog-picker span-2">
      <legend>Escolha os servicos e produtos</legend>
      <div className="form-grid embedded-form-grid">
        <label>
          Tipo de item
          <select
            value={type}
            onChange={(event) => changeType(event.target.value as QuoteFormItem["type"])}
          >
            <option value="SERVICE">{itemTypeLabels.SERVICE}</option>
            <option value="PRODUCT">{itemTypeLabels.PRODUCT}</option>
          </select>
        </label>
        <label>
          {type === "SERVICE" ? "Servico" : "Produto/peca"}
          <select value={selectedId} onChange={(event) => selectItem(event.target.value)}>
            <option value="">Selecione...</option>
            {options.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} -{" "}
                {formatCurrency("defaultPrice" in item ? item.defaultPrice : item.salePrice)}
              </option>
            ))}
          </select>
        </label>
        <label>
          Quantidade
          <input
            inputMode="decimal"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
        </label>
        <label>
          Valor unitario
          <CurrencyInput value={unitPrice} onChange={setUnitPrice} />
        </label>
        <label>
          Desconto do item
          <CurrencyInput value={discountAmount} onChange={setDiscountAmount} />
        </label>
        <button
          className="button-secondary align-end"
          disabled={!selectedId}
          type="button"
          onClick={addItem}
        >
          Adicionar item
        </button>
      </div>
      {options.length === 0 ? (
        <small>
          Cadastre ao menos um {type === "SERVICE" ? "servico" : "produto"} ativo para adicionar.
        </small>
      ) : null}
    </fieldset>
  );
}
