import { useState } from "react";

import type { CatalogProduct } from "../../../lib/api/schema";
import { createStockMovement } from "../api/products.api";

export function StockMovementForm({
  products,
  onDone,
}: {
  products: CatalogProduct[];
  onDone: () => void;
}) {
  const [productId, setProductId] = useState("");
  const [type, setType] = useState("ENTRY");
  const [quantity, setQuantity] = useState("1.000");
  const [reason, setReason] = useState("Movimentacao manual");

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    await createStockMovement(productId, { type, quantity, reason });
    onDone();
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>
        Produto
        <select value={productId} onChange={(event) => setProductId(event.target.value)} required>
          <option value="">Selecione...</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </select>
      </label>
      <label>
        Tipo
        <select value={type} onChange={(event) => setType(event.target.value)}>
          <option value="ENTRY">Entrada</option>
          <option value="EXIT">Saida</option>
          <option value="ADJUSTMENT">Ajuste</option>
        </select>
      </label>
      <label>
        Quantidade
        <input value={quantity} onChange={(event) => setQuantity(event.target.value)} />
      </label>
      <label>
        Motivo
        <input value={reason} onChange={(event) => setReason(event.target.value)} />
      </label>
      <button className="button-primary" type="submit">
        Registrar movimento
      </button>
    </form>
  );
}
