import { useState } from "react";

import { getApiErrorMessage } from "../../../lib/api/errors";
import type { UserRole } from "../../../lib/api/schema";
import { roleLabels } from "../../../lib/formatters/labels";

export function UserForm({ onSubmit }: { onSubmit: (input: unknown) => Promise<void> }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "Usuario@12345",
    role: "ATENDENTE" as UserRole,
    status: "ACTIVE",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
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
            email: "",
            password: "Usuario@12345",
            role: "ATENDENTE",
            status: "ACTIVE",
          });
          setSuccess("Usuario criado com sucesso.");
        } catch (caught) {
          setError(getApiErrorMessage(caught, "Nao foi possivel criar o usuario."));
        } finally {
          setSubmitting(false);
        }
      }}
    >
      <label>
        Nome completo *
        <input
          value={form.name}
          onChange={(event) => update("name", event.target.value)}
          required
        />
      </label>
      <label>
        E-mail *
        <input
          type="email"
          value={form.email}
          onChange={(event) => update("email", event.target.value)}
          required
        />
      </label>
      <label>
        Senha inicial *
        <input
          value={form.password}
          onChange={(event) => update("password", event.target.value)}
          required
        />
      </label>
      <label>
        Perfil
        <select value={form.role} onChange={(event) => update("role", event.target.value)}>
          <option value="ADMIN">{roleLabels.ADMIN}</option>
          <option value="ATENDENTE">{roleLabels.ATENDENTE}</option>
          <option value="TECNICO">{roleLabels.TECNICO}</option>
          <option value="FINANCEIRO">{roleLabels.FINANCEIRO}</option>
        </select>
      </label>
      {error ? <p className="form-error span-2">{error}</p> : null}
      {success ? <p className="success-message span-2">{success}</p> : null}
      <button className="button-primary" disabled={submitting} type="submit">
        {submitting ? "Criando..." : "Criar usuario"}
      </button>
    </form>
  );
}
