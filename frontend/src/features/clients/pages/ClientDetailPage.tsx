import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getApiErrorMessage } from "../../../lib/api/errors";
import { getClientHistory, updateClient, type ClientHistory } from "../api/clients.api";
import { ClientHistoryReport } from "../components/ClientHistoryReport";
import { ClientForm } from "../components/ClientForm";

export function ClientDetailPage() {
  const { id } = useParams();
  const [client, setClient] = useState<ClientHistory>();
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setClient(undefined); setError("");
    if (id) getClientHistory(id).then((data) => { if (active) setClient(data); })
      .catch((caught) => { if (active) setError(getApiErrorMessage(caught, "Nao foi possivel carregar o historico.")); });
    return () => { active = false; };
  }, [id]);

  if (!client || !id) return <section className="panel">{error || "Carregando cliente..."}</section>;

  return (
    <section className="panel">
      <p className="eyebrow">Cliente</p>
      <h2>{client.name}</h2>
      <details className="print-hidden"><summary>Editar cadastro do cliente</summary><ClientForm
        client={client}
        onSubmit={async (input) => {
          setClient({ ...client, ...(await updateClient(id, input)) });
        }}
      /></details>
      <ClientHistoryReport client={client} />
    </section>
  );
}
