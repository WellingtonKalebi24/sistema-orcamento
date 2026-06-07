import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { Client } from "../../../lib/api/schema";
import { deleteClient, listClients } from "../api/clients.api";

export function ClientsPage() {
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    listClients(search)
      .then(setClients)
      .catch(() => setClients([]));
  }, [search]);

  return (
    <section className="panel">
      <div className="page-header inline-header">
        <div>
          <p className="eyebrow">Clientes</p>
          <h2>Cadastro e historico</h2>
        </div>
        <Link className="button-primary" to="/clientes/novo">
          Novo cliente
        </Link>
      </div>
      <input
        placeholder="Buscar cliente"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div className="table-card">
        {clients.map((client) => (
          <div className="table-row" key={client.id}>
            <Link to={`/clientes/${client.id}`}>
              <strong>{client.name}</strong>
            </Link>
            <span>{client.document}</span>
            <span>{client.whatsapp ?? client.phone}</span>
            <button
              className="button-secondary"
              type="button"
              onClick={() =>
                deleteClient(client.id).then(() =>
                  setClients((current) => current.filter((item) => item.id !== client.id)),
                )
              }
            >
              Inativar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
