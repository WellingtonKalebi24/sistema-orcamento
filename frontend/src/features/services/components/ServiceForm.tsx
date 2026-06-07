import { useState } from "react";

import type { CatalogService } from "../../../lib/api/schema";

export function ServiceForm({
  onSubmit,
}: {
  onSubmit: (input: Partial<CatalogService>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: "",
    defaultPrice: "0.00",
    estimatedMinutes: 60,
  });

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [field]: field === "estimatedMinutes" ? Number(value) : value,
    }));
  }

  return (
    <form
      className="form-grid"
      onSubmit={(event) => {
        event.preventDefault();
        void onSubmit(form);
      }}
    >
      <label>
        Nome
        <input
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          required
        />
      </label>
      <label>
        Categoria
        <input
          value={form.category}
          onChange={(event) => update("category", event.target.value)}
          required
        />
      </label>
      <label className="span-2">
        Descricao
        <textarea
          value={form.description}
          onChange={(event) => update("description", event.target.value)}
        />
      </label>
      <label>
        Valor padrao
        <input
          value={form.defaultPrice}
          onChange={(event) => update("defaultPrice", event.target.value)}
        />
      </label>
      <label>
        Tempo estimado em minutos
        <input
          type="number"
          value={form.estimatedMinutes}
          onChange={(event) => update("estimatedMinutes", event.target.value)}
        />
      </label>
      <button className="button-primary" type="submit">
        Salvar servico
      </button>
    </form>
  );
}
