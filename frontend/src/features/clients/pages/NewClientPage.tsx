import { useState } from "react";

import { createClient } from "../api/clients.api";

export function NewClientPage() {
  const [saved, setSaved] = useState("");
  const [form, setForm] = useState<{
    name: string;
    personType: "PF" | "PJ";
    document: string;
    phone: string;
    whatsapp: string;
    email: string;
    city: string;
    state: string;
    notes: string;
  }>({
    name: "",
    personType: "PF",
    document: "",
    phone: "",
    whatsapp: "",
    email: "",
    city: "",
    state: "",
    notes: "",
  });

  function update(field: string, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    const client = await createClient(form);
    setSaved(`Cliente ${client.name} cadastrado.`);
  }

  return (
    <section className="panel">
      <p className="eyebrow">Clientes</p>
      <h2>Novo cliente</h2>
      <form className="form-grid" onSubmit={submit}>
        <label>
          Nome ou razao social
          <input
            value={form.name}
            onChange={(event) => update("name", event.target.value)}
            required
          />
        </label>
        <label>
          Tipo
          <select
            value={form.personType}
            onChange={(event) => update("personType", event.target.value as "PF" | "PJ")}
          >
            <option value="PF">Pessoa fisica</option>
            <option value="PJ">Pessoa juridica</option>
          </select>
        </label>
        <label>
          CPF/CNPJ
          <input
            value={form.document}
            onChange={(event) => update("document", event.target.value)}
            required
          />
        </label>
        <label>
          WhatsApp
          <input
            value={form.whatsapp}
            onChange={(event) => update("whatsapp", event.target.value)}
          />
        </label>
        <label>
          E-mail
          <input value={form.email} onChange={(event) => update("email", event.target.value)} />
        </label>
        <label>
          Cidade
          <input value={form.city} onChange={(event) => update("city", event.target.value)} />
        </label>
        <label>
          UF
          <input
            value={form.state}
            onChange={(event) => update("state", event.target.value)}
            maxLength={2}
          />
        </label>
        <label className="span-2">
          Observacoes
          <textarea value={form.notes} onChange={(event) => update("notes", event.target.value)} />
        </label>
        <button className="button-primary" type="submit">
          Salvar cliente
        </button>
      </form>
      {saved ? <p className="success-message">{saved}</p> : null}
    </section>
  );
}
