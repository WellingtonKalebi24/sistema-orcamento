import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import type { Client } from "../../../lib/api/schema";
import { getClientHistory, updateClient } from "../api/clients.api";
import { ClientForm } from "../components/ClientForm";

export function ClientDetailPage() {
  const { id } = useParams();
  const [client, setClient] = useState<
    (Client & { quotes?: unknown[]; workOrders?: unknown[] }) | undefined
  >();

  useEffect(() => {
    if (id) getClientHistory(id).then(setClient);
  }, [id]);

  if (!client || !id) return <section className="panel">Carregando cliente...</section>;

  return (
    <section className="panel">
      <p className="eyebrow">Cliente</p>
      <h2>{client.name}</h2>
      <ClientForm
        client={client}
        onSubmit={async (input) => {
          setClient({ ...client, ...(await updateClient(id, input)) });
        }}
      />
      <div className="panels detail-panels">
        <div className="table-card">
          <strong>Historico de orcamentos</strong>
          <p>{client.quotes?.length ?? 0} registro(s)</p>
        </div>
        <div className="table-card">
          <strong>Historico de OS</strong>
          <p>{client.workOrders?.length ?? 0} registro(s)</p>
        </div>
      </div>
    </section>
  );
}
