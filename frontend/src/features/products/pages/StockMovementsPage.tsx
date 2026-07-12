import { useEffect, useState } from "react";

import type { CatalogProduct, StockMovement } from "../../../lib/api/schema";
import { stockMovementTypeLabels } from "../../../lib/formatters/labels";
import { listProducts, listStockMovements } from "../api/products.api";
import { StockMovementForm } from "../components/StockMovementForm";

export function StockMovementsPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [movements, setMovements] = useState<StockMovement[]>([]);

  function reload() {
    listProducts().then(setProducts);
    listStockMovements()
      .then(setMovements)
      .catch(() => setMovements([]));
  }

  useEffect(reload, []);

  return (
    <section className="panel">
      <p className="eyebrow">Estoque</p>
      <h2>Movimentacoes manuais e historico</h2>
      <StockMovementForm products={products} onDone={reload} />
      <div className="table-card">
        {movements.map((movement) => (
          <div className="table-row" key={movement.id}>
            <strong>{movement.product?.name ?? movement.productId}</strong>
            <span>{stockMovementTypeLabels[movement.type]}</span>
            <span>{movement.quantity}</span>
            <span>
              {movement.previousBalance} {"->"} {movement.newBalance}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
