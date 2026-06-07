import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { CatalogProduct } from "../../../lib/api/schema";
import { formatCurrency } from "../../../lib/formatters/currency";
import { createProduct, deleteProduct, listProducts } from "../api/products.api";

export function ProductsPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [form, setForm] = useState({
    name: "",
    sku: "",
    category: "",
    unit: "UN",
    stockQuantity: "0.000",
    minimumStock: "0.000",
    costPrice: "0.00",
    salePrice: "0.00",
  });

  function reload() {
    listProducts()
      .then(setProducts)
      .catch(() => setProducts([]));
  }

  useEffect(reload, []);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  return (
    <section className="panel">
      <div className="page-header inline-header">
        <div>
          <p className="eyebrow">Produtos e estoque</p>
          <h2>Pecas, saldos e alerta minimo</h2>
        </div>
        <Link className="button-secondary" to="/estoque/movimentos">
          Movimentos
        </Link>
      </div>
      <form
        className="form-grid"
        onSubmit={async (event) => {
          event.preventDefault();
          await createProduct(form);
          reload();
        }}
      >
        {(
          [
            "name",
            "sku",
            "category",
            "unit",
            "stockQuantity",
            "minimumStock",
            "costPrice",
            "salePrice",
          ] as const
        ).map((field) => (
          <label key={field}>
            {field}
            <input
              value={form[field]}
              onChange={(event) => update(field, event.target.value)}
              required
            />
          </label>
        ))}
        <button className="button-primary" type="submit">
          Salvar produto
        </button>
      </form>
      <div className="table-card">
        {products.map((product) => (
          <div className="table-row" key={product.id}>
            <strong>{product.name}</strong>
            <span>{product.sku}</span>
            <span>
              {product.stockQuantity} {product.unit} {product.lowStock ? "(baixo)" : ""}
            </span>
            <span>{formatCurrency(product.salePrice)}</span>
            <button
              className="button-secondary"
              type="button"
              onClick={() => deleteProduct(product.id).then(reload)}
            >
              Inativar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
