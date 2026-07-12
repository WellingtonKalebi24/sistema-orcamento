import { useState } from "react";

import { getApiErrorMessage } from "../../../lib/api/errors";
import type { CatalogProduct } from "../../../lib/api/schema";
import { stockMovementTypeLabels } from "../../../lib/formatters/labels";
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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      await createStockMovement(productId, { type, quantity, reason });
      setQuantity("1.000");
      setReason("Movimentacao manual");
      setSuccess("Movimento registrado com sucesso.");
      onDone();
    } catch (caught) {
      setError(getApiErrorMessage(caught, "Nao foi possivel registrar o movimento."));
    } finally {
      setSubmitting(false);
    }
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
          <option value="ENTRY">{stockMovementTypeLabels.ENTRY}</option>
          <option value="EXIT">{stockMovementTypeLabels.EXIT}</option>
          <option value="ADJUSTMENT">{stockMovementTypeLabels.ADJUSTMENT}</option>
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
        Motivo
        <input value={reason} onChange={(event) => setReason(event.target.value)} />
      </label>
      {error ? <p className="form-error span-2">{error}</p> : null}
      {success ? <p className="success-message span-2">{success}</p> : null}
      <button className="button-primary" disabled={submitting} type="submit">
        {submitting ? "Registrando..." : "Registrar movimento"}
      </button>
    </form>
  );
}
