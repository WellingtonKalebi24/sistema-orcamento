import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { CurrencyInput } from "../../../components/forms/CurrencyInput";
import { QuickOptionSelect } from "../../../components/forms/QuickOptionSelect";
import { getApiErrorMessage } from "../../../lib/api/errors";
import type { CatalogProduct } from "../../../lib/api/schema";
import { formatCurrency } from "../../../lib/formatters/currency";
import { createProduct, deleteProduct, listProducts, updateProduct } from "../api/products.api";

export function ProductsPage() {
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState("");
  const [form, setForm] = useState({
    name: "",
    category: "",
    supplier: "",
    unit: "UN",
    stockQuantity: "0.000",
    minimumStock: "0.000",
    costPrice: "0.00",
    salePrice: "0.00",
  });

  const initialForm = {
    name: "",
    category: "",
    supplier: "",
    unit: "UN",
    stockQuantity: "0.000",
    minimumStock: "0.000",
    costPrice: "0.00",
    salePrice: "0.00",
  };

  function reload() {
    listProducts()
      .then((data) => {
        setProducts(data);
        setError("");
      })
      .catch((caught) => {
        setProducts([]);
        setError(getApiErrorMessage(caught, "Nao foi possivel carregar os produtos."));
      });
  }

  useEffect(reload, []);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function startEditing(product: CatalogProduct) {
    setEditingId(product.id);
    setError("");
    setSuccess("");
    setForm({
      name: product.name,
      category: product.category ?? "",
      supplier: product.supplier ?? "",
      unit: product.unit,
      stockQuantity: product.stockQuantity ?? "0.000",
      minimumStock: product.minimumStock ?? "0.000",
      costPrice: product.costPrice,
      salePrice: product.salePrice,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function cancelEditing() {
    setEditingId("");
    setForm(initialForm);
    setError("");
    setSuccess("");
  }

  const categories = Array.from(
    new Set(
      products
        .map((product) => product.category)
        .filter((value): value is string => Boolean(value)),
    ),
  ).sort();
  if (form.category && !categories.includes(form.category)) categories.push(form.category);

  const suppliers = Array.from(
    new Set(
      products
        .map((product) => product.supplier)
        .filter((value): value is string => Boolean(value)),
    ),
  ).sort();
  if (form.supplier && !suppliers.includes(form.supplier)) suppliers.push(form.supplier);

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
          setError("");
          setSuccess("");
          setSubmitting(true);

          try {
            if (editingId) await updateProduct(editingId, form);
            else await createProduct(form);
            setForm(initialForm);
            setSuccess(
              editingId ? "Produto atualizado com sucesso." : "Produto salvo com sucesso.",
            );
            setEditingId("");
            reload();
          } catch (caught) {
            setError(getApiErrorMessage(caught, "Nao foi possivel salvar o produto."));
          } finally {
            setSubmitting(false);
          }
        }}
      >
        <label>
          Nome do produto *
          <input
            placeholder="Ex.: Placa principal"
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            required
          />
        </label>
        <QuickOptionSelect
          label="Categoria"
          options={categories}
          placeholder="Selecione a categoria"
          value={form.category}
          onChange={(value) => update("category", value)}
        />
        <QuickOptionSelect
          label="Fornecedor"
          options={suppliers}
          placeholder="Selecione o fornecedor"
          required={false}
          value={form.supplier}
          onChange={(value) => update("supplier", value)}
        />
        <label>
          Unidade de medida *
          <select value={form.unit} onChange={(event) => update("unit", event.target.value)}>
            <option value="UN">Unidade</option>
            <option value="M">Metro</option>
            <option value="KG">Quilograma</option>
            <option value="L">Litro</option>
            <option value="CX">Caixa</option>
          </select>
        </label>
        <label>
          Quantidade em estoque *
          <input
            inputMode="decimal"
            value={form.stockQuantity}
            onChange={(event) => update("stockQuantity", event.target.value)}
            required
          />
        </label>
        <label>
          Estoque minimo *
          <input
            inputMode="decimal"
            value={form.minimumStock}
            onChange={(event) => update("minimumStock", event.target.value)}
            required
          />
        </label>
        <label>
          Preco de custo *
          <CurrencyInput
            value={form.costPrice}
            onChange={(value) => update("costPrice", value)}
            required
          />
        </label>
        <label>
          Preco de venda *
          <CurrencyInput
            value={form.salePrice}
            onChange={(value) => update("salePrice", value)}
            required
          />
        </label>
        {error ? <p className="form-error span-2">{error}</p> : null}
        {success ? <p className="success-message span-2">{success}</p> : null}
        <button className="button-primary" disabled={submitting} type="submit">
          {submitting ? "Salvando..." : editingId ? "Atualizar produto" : "Salvar produto"}
        </button>
        {editingId ? (
          <button className="button-ghost" type="button" onClick={cancelEditing}>
            Cancelar edicao
          </button>
        ) : null}
      </form>
      <div className="section-heading">
        <div>
          <h3>Produtos cadastrados</h3>
          <p>Os produtos ativos ficam disponiveis em orcamentos, ordens de servico e estoque.</p>
        </div>
        <span className="count-badge">{products.length}</span>
      </div>
      <div className="table-card">
        {products.length === 0 ? <p>Nenhum produto cadastrado.</p> : null}
        {products.map((product) => (
          <div className="table-row" key={product.id}>
            <strong>{product.name}</strong>
            <span>{product.category}</span>
            <span>{product.supplier || "Sem fornecedor"}</span>
            <span>
              {product.stockQuantity} {product.unit} {product.lowStock ? "(baixo)" : ""}
            </span>
            <span>{formatCurrency(product.salePrice)}</span>
            <div className="row-actions">
              <button
                className="button-secondary"
                type="button"
                onClick={() => startEditing(product)}
              >
                Editar
              </button>
              <button
                className="button-danger"
                type="button"
                onClick={async () => {
                  setError("");
                  try {
                    await deleteProduct(product.id);
                    setSuccess("Produto inativado. O historico foi preservado.");
                    reload();
                  } catch (caught) {
                    setError(getApiErrorMessage(caught, "Nao foi possivel inativar o produto."));
                  }
                }}
              >
                Inativar
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
