import { useState } from "react";

import { getApiErrorMessage } from "../../../lib/api/errors";
import type { CompanySettings } from "../../../lib/api/schema";
import { updateCompanySettings, uploadCompanyLogo } from "../api/settings.api";

export function CompanySettingsForm({
  settings,
  onChange,
}: {
  settings: CompanySettings;
  onChange: (settings: CompanySettings) => void;
}) {
  const [form, setForm] = useState({
    ...settings,
    systemName: settings.systemName || "Sistema OS",
    primaryColor: settings.primaryColor || "#245dde",
    sidebarColor: settings.sidebarColor || "#12233e",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof CompanySettings, value: string | boolean) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setSubmitting(true);

    try {
      const updated = await updateCompanySettings(form);
      onChange(updated);
      window.dispatchEvent(new Event("company-settings-updated"));
      setSuccess("Configuracoes salvas com sucesso.");
    } catch (caught) {
      setError(getApiErrorMessage(caught, "Nao foi possivel salvar as configuracoes."));
    } finally {
      setSubmitting(false);
    }
  }

  async function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setSuccess("");

    try {
      const updated = await uploadCompanyLogo(file);
      onChange(updated);
      window.dispatchEvent(new Event("company-settings-updated"));
      setSuccess("Logo enviada com sucesso.");
    } catch (caught) {
      setError(getApiErrorMessage(caught, "Nao foi possivel enviar a logo."));
    }
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>
        Nome da empresa *
        <input
          value={form.companyName}
          onChange={(event) => update("companyName", event.target.value)}
          required
        />
      </label>
      <label>
        Nome exibido no sistema *
        <input
          value={form.systemName}
          onChange={(event) => update("systemName", event.target.value)}
          required
        />
      </label>
      <label>
        CNPJ *
        <input
          value={form.cnpj}
          onChange={(event) => update("cnpj", event.target.value)}
          required
        />
      </label>
      <label>
        Telefone
        <input value={form.phone ?? ""} onChange={(event) => update("phone", event.target.value)} />
      </label>
      <label>
        WhatsApp
        <input
          value={form.whatsapp ?? ""}
          onChange={(event) => update("whatsapp", event.target.value)}
        />
      </label>
      <label>
        E-mail
        <input value={form.email ?? ""} onChange={(event) => update("email", event.target.value)} />
      </label>
      <label>
        Pix
        <input
          value={form.pixKey ?? ""}
          onChange={(event) => update("pixKey", event.target.value)}
        />
      </label>
      <label className="span-2">
        Endereco
        <input
          value={form.address ?? ""}
          onChange={(event) => update("address", event.target.value)}
        />
      </label>
      <label className="span-2">
        Dados bancarios
        <textarea
          value={form.bankDetails ?? ""}
          onChange={(event) => update("bankDetails", event.target.value)}
        />
      </label>
      <label className="span-2">
        Texto padrao do orcamento
        <textarea
          value={form.defaultQuoteText ?? ""}
          onChange={(event) => update("defaultQuoteText", event.target.value)}
        />
      </label>
      <label className="span-2">
        Rodape do PDF
        <textarea
          value={form.defaultPdfFooter ?? ""}
          onChange={(event) => update("defaultPdfFooter", event.target.value)}
        />
      </label>
      <label>
        Permitir estoque negativo
        <select
          value={String(form.allowNegativeStock)}
          onChange={(event) => update("allowNegativeStock", event.target.value === "true")}
        >
          <option value="false">Nao</option>
          <option value="true">Sim</option>
        </select>
      </label>
      <label>
        Cor principal
        <input
          type="color"
          value={form.primaryColor}
          onChange={(event) => update("primaryColor", event.target.value)}
        />
      </label>
      <label>
        Cor do menu
        <input
          type="color"
          value={form.sidebarColor}
          onChange={(event) => update("sidebarColor", event.target.value)}
        />
      </label>
      <label>
        Logo do sistema e do PDF
        <input accept="image/png,image/jpeg,image/webp" type="file" onChange={onFileChange} />
      </label>
      {error ? <p className="form-error span-2">{error}</p> : null}
      {success ? <p className="success-message span-2">{success}</p> : null}
      <button className="button-primary" disabled={submitting} type="submit">
        {submitting ? "Salvando..." : "Salvar configuracoes"}
      </button>
    </form>
  );
}
