import { useState } from "react";

import type { Client } from "../../../lib/api/schema";

type ClientFormInput = Partial<Client> & {
  city?: string;
  state?: string;
  notes?: string;
};

const initial: ClientFormInput = {
  name: "",
  personType: "PF",
  document: "",
  phone: "",
  whatsapp: "",
  email: "",
  city: "",
  state: "",
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

  function update(field: keyof ClientFormInput, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    await onSubmit(form);
    setSaved("Cliente salvo com sucesso.");
  }

  return (
    <form className="form-grid" onSubmit={submit}>
      <label>
        Nome ou razao social
        <input
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
        CPF/CNPJ
        <input
          value={form.document ?? ""}
          onChange={(event) => update("document", event.target.value)}
          required
        />
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
        Cidade
        <input value={form.city ?? ""} onChange={(event) => update("city", event.target.value)} />
      </label>
      <label>
        UF
        <input
          maxLength={2}
          value={form.state ?? ""}
          onChange={(event) => update("state", event.target.value)}
        />
      </label>
      <label className="span-2">
        Observacoes
        <textarea
          value={form.notes ?? ""}
          onChange={(event) => update("notes", event.target.value)}
        />
      </label>
      <button className="button-primary" type="submit">
        Salvar cliente
      </button>
      {saved ? <p className="success-message span-2">{saved}</p> : null}
    </form>
  );
}
