import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getApiErrorMessage } from "../../../lib/api/errors";
import type { Client } from "../../../lib/api/schema";
import { listClients } from "../api/clients.api";

export function ClientPicker({
  value,
  onChange,
}: {
  value?: string;
  onChange: (clientId: string) => void;
}) {
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setLoading(true);
      listClients(search)
        .then((data) => {
          setClients(data);
          setError("");
        })
        .catch((caught) => {
          setClients([]);
          setError(getApiErrorMessage(caught, "Nao foi possivel carregar os clientes."));
        })
        .finally(() => setLoading(false));
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [search]);

  const selectedClient = clients.find((client) => client.id === value);

  return (
    <div className="client-picker">
      <div className="field-heading">
        <strong>Cliente *</strong>
        <Link className="button-link" to="/clientes/novo">
          + Novo cliente
        </Link>
      </div>
      <input
        aria-label="Buscar cliente"
        placeholder="Digite o nome ou CPF/CNPJ"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <select
        aria-label="Selecionar cliente"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        required
      >
        <option value="">{loading ? "Carregando clientes..." : "Selecione um cliente..."}</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name} - {client.document}
          </option>
        ))}
      </select>
      {selectedClient ? (
        <small className="selected-summary">
          Selecionado: <strong>{selectedClient.name}</strong>
        </small>
      ) : null}
      {!loading && clients.length === 0 && !error ? (
        <small>Nenhum cliente encontrado. Cadastre um cliente antes de continuar.</small>
      ) : null}
      {error ? <small className="field-error">{error}</small> : null}
    </div>
  );
}
