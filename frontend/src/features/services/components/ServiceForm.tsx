import { useState } from "react";

import { CurrencyInput } from "../../../components/forms/CurrencyInput";
import { QuickOptionSelect } from "../../../components/forms/QuickOptionSelect";
import { getApiErrorMessage } from "../../../lib/api/errors";
import type { CatalogService } from "../../../lib/api/schema";

export function ServiceForm({
  categories,
  service,
  onCancel,
  onSubmit,
}: {
  categories: string[];
  service?: CatalogService;
  onCancel?: () => void;
  onSubmit: (input: Partial<CatalogService>) => Promise<void>;
}) {
  const [form, setForm] = useState({
    name: service?.name ?? "",
    description: service?.description ?? "",
    category: service?.category ?? "",
    defaultPrice: service?.defaultPrice ?? "0.00",
    estimatedMinutes: service?.estimatedMinutes ?? 60,
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [field]: field === "estimatedMinutes" ? Number(value) : value,
    }));
  }

  return (
    <form
      className="form-grid"
      onSubmit={async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setSubmitting(true);

        try {
          await onSubmit(form);
          setForm({
            name: "",
            description: "",
            category: "",
            defaultPrice: "0.00",
            estimatedMinutes: 60,
          });
          setSuccess(service ? "Servico atualizado com sucesso." : "Servico salvo com sucesso.");
        } catch (caught) {
          setError(getApiErrorMessage(caught, "Nao foi possivel salvar o servico."));
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <label>
        Nome do servico *
        <input
          placeholder="Ex.: Instalacao de ar-condicionado"
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          required
        />
      </label>
      <QuickOptionSelect
        label="Categoria"
        options={
          form.category && !categories.includes(form.category)
            ? [...categories, form.category]
            : categories
        }
        placeholder="Selecione a categoria"
        value={form.category}
        onChange={(value) => update("category", value)}
      />
      <label className="span-2">
        Descricao *
        <textarea
          placeholder="Descreva o que esta incluso neste servico"
          value={form.description}
          onChange={(event) => update("description", event.target.value)}
          required
        />
      </label>
      <label>
        Valor padrao *
        <CurrencyInput
          value={form.defaultPrice}
          onChange={(value) => update("defaultPrice", value)}
          required
        />
      </label>
      <label>
        Tempo estimado em minutos *
        <input
          min={1}
          type="number"
          value={form.estimatedMinutes}
          onChange={(event) => update("estimatedMinutes", event.target.value)}
          required
        />
      </label>
      {error ? <p className="form-error span-2">{error}</p> : null}
      {success ? <p className="success-message span-2">{success}</p> : null}
      <button className="button-primary" disabled={submitting} type="submit">
        {submitting ? "Salvando..." : service ? "Atualizar servico" : "Salvar servico"}
      </button>
      {service && onCancel ? (
        <button className="button-ghost" type="button" onClick={onCancel}>
          Cancelar edicao
        </button>
      ) : null}
    </form>
  );
}
