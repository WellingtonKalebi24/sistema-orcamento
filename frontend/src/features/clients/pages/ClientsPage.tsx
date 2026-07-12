import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { Client } from "../../../lib/api/schema";
import { getApiErrorMessage } from "../../../lib/api/errors";
import { deleteClient, listClients } from "../api/clients.api";

export function ClientsPage() {
  const [search, setSearch] = useState("");
  const [clients, setClients] = useState<Client[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    listClients(search)
      .then((data) => {
        setClients(data);
        setError("");
      })
      .catch((caught) => {
        setClients([]);
        setError(getApiErrorMessage(caught, "Nao foi possivel carregar os clientes."));
      });
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
      {error ? <p className="form-error">{error}</p> : null}
      <div className="section-heading">
        <div>
          <h3>Clientes cadastrados</h3>
          <p>Clique em editar para alterar os dados ou consultar o historico.</p>
        </div>
        <span className="count-badge">{clients.length}</span>
      </div>
      <div className="table-card">
        {clients.length === 0 && !error ? <p>Nenhum cliente encontrado.</p> : null}
        {clients.map((client) => (
          <div className="table-row" key={client.id}>
            <strong>{client.name}</strong>
            <span>{client.document}</span>
            <span>{client.whatsapp ?? client.phone ?? "Sem telefone"}</span>
            <div className="row-actions">
              <Link className="button-secondary" to={`/clientes/${client.id}`}>
                Editar
              </Link>
              <button
                className="button-danger"
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
          </div>
        ))}
      </div>
    </section>
  );
}
