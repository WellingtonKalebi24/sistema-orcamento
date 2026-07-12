import { useState } from "react";

import { getApiErrorMessage } from "../../../lib/api/errors";
import type { Client } from "../../../lib/api/schema";

type ClientFormInput = Partial<Client> & {
  street?: string;
  number?: string;
  complement?: string;
  district?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  notes?: string;
};

const initial: ClientFormInput = {
  name: "",
  personType: "PF",
  document: "",
  phone: "",
  whatsapp: "",
  email: "",
  street: "",
  number: "",
  complement: "",
  district: "",
  city: "",
  state: "",
  zipCode: "",
  notes: "",
};

export function ClientForm({
  client,
  onSubmit,
}: {
  client?: ClientFormInput;
  onSubmit: (input: ClientFormInput) => Promise<void>;
}) {
  const [form, setForm] = useState<ClientFormInput>({ ...initial, ...client });
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function update(field: keyof ClientFormInput, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setSaved("");
    setError("");
    setSubmitting(true);

    try {
      await onSubmit(form);
      setSaved("Cliente salvo com sucesso.");
    } catch (caught) {
      setError(getApiErrorMessage(caught, "Nao foi possivel salvar o cliente."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>
        Nome completo ou razao social *
        <input
          autoComplete="name"
          placeholder="Ex.: Maria Silva ou Empresa LTDA"
          value={form.name ?? ""}
          onChange={(event) => update("name", event.target.value)}
          required
        />
      </label>
      <label>
        Tipo
        <select
          value={form.personType ?? "PF"}
          onChange={(event) => update("personType", event.target.value)}
        >
          <option value="PF">Pessoa fisica</option>
          <option value="PJ">Pessoa juridica</option>
        </select>
      </label>
      <label>
        CPF ou CNPJ *
        <input
          inputMode="numeric"
          placeholder="Somente numeros ou com mascara"
          value={form.document ?? ""}
          onChange={(event) => update("document", event.target.value)}
          required
        />
      </label>
      <label>
        Telefone
        <input
          autoComplete="tel"
          placeholder="(11) 3000-0000"
          value={form.phone ?? ""}
          onChange={(event) => update("phone", event.target.value)}
        />
      </label>
      <label>
        WhatsApp
        <input
          autoComplete="tel"
          placeholder="(11) 99999-9999"
          value={form.whatsapp ?? ""}
          onChange={(event) => update("whatsapp", event.target.value)}
        />
      </label>
      <label>
        E-mail
        <input
          autoComplete="email"
          placeholder="cliente@email.com"
          type="email"
          value={form.email ?? ""}
          onChange={(event) => update("email", event.target.value)}
        />
      </label>
      <label>
        Rua
        <input
          autoComplete="address-line1"
          value={form.street ?? ""}
          onChange={(event) => update("street", event.target.value)}
        />
      </label>
      <label>
        Numero
        <input
          autoComplete="address-line2"
          value={form.number ?? ""}
          onChange={(event) => update("number", event.target.value)}
        />
      </label>
      <label>
        Bairro
        <input
          value={form.district ?? ""}
          onChange={(event) => update("district", event.target.value)}
        />
      </label>
      <label>
        Cidade
        <input
          autoComplete="address-level2"
          value={form.city ?? ""}
          onChange={(event) => update("city", event.target.value)}
        />
      </label>
      <label>
        UF
        <input
          autoComplete="address-level1"
          maxLength={2}
          value={form.state ?? ""}
          onChange={(event) => update("state", event.target.value.toUpperCase())}
        />
      </label>
      <label>
        CEP
        <input
          autoComplete="postal-code"
          inputMode="numeric"
          value={form.zipCode ?? ""}
          onChange={(event) => update("zipCode", event.target.value)}
        />
      </label>
      <label className="span-2">
        Observacoes
        <textarea
          value={form.notes ?? ""}
          onChange={(event) => update("notes", event.target.value)}
        />
      </label>
      {error ? <p className="form-error span-2">{error}</p> : null}
      <button className="button-primary" disabled={submitting} type="submit">
        {submitting ? "Salvando..." : "Salvar cliente"}
      </button>
      {saved ? <p className="success-message span-2">{saved}</p> : null}
    </form>
  );
}
