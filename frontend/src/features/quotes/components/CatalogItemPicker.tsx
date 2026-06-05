import { useEffect, useState } from "react";

import { listCatalog, type CatalogResponse } from "../api/quotes.api";

export type QuoteFormItem = {
  type: "SERVICE" | "PRODUCT";
  productId?: string;
  serviceId?: string;
  quantity: string;
  unitPrice: string;
  discountAmount: string;
};

export function CatalogItemPicker({ onAdd }: { onAdd: (item: QuoteFormItem) => void }) {
  const [catalog, setCatalog] = useState<CatalogResponse>({ products: [], services: [] });

  useEffect(() => {
    listCatalog()
      .then(setCatalog)
      .catch(() => setCatalog({ products: [], services: [] }));
  }, []);

  return (
    <div className="catalog-picker">
      <button
        className="button-secondary"
        type="button"
        onClick={() => {
          const service = catalog.services[0];
          if (service)
            onAdd({
              type: "SERVICE",
              serviceId: service.id,
              quantity: "1.000",
              unitPrice: service.defaultPrice,
              discountAmount: "0.00",
            });
        }}
      >
        Adicionar servico
      </button>
      <button
        className="button-secondary"
        type="button"
        onClick={() => {
          const product = catalog.products[0];
          if (product)
            onAdd({
              type: "PRODUCT",
              productId: product.id,
              quantity: "1.000",
              unitPrice: product.salePrice,
              discountAmount: "0.00",
            });
        }}
      >
        Adicionar produto
      </button>
      <small>
        O picker usa o primeiro item ativo do catalogo. Cadastros completos entram na fase de
        estoque/cadastros.
      </small>
    </div>
  );
}
