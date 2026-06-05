import { useEffect, useState } from "react";

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

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      listClients(search)
        .then(setClients)
        .catch(() => setClients([]));
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [search]);

  return (
    <label>
      Cliente
      <input
        placeholder="Buscar cliente"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <select value={value ?? ""} onChange={(event) => onChange(event.target.value)} required>
        <option value="">Selecione...</option>
        {clients.map((client) => (
          <option key={client.id} value={client.id}>
            {client.name} - {client.document}
          </option>
        ))}
      </select>
    </label>
  );
}
