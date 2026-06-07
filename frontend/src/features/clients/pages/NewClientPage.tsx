import { useNavigate } from "react-router-dom";

import { createClient } from "../api/clients.api";
import { ClientForm } from "../components/ClientForm";

export function NewClientPage() {
  const navigate = useNavigate();

  return (
    <section className="panel">
      <p className="eyebrow">Clientes</p>
      <h2>Novo cliente</h2>
      <ClientForm
        onSubmit={async (input) => {
          const client = await createClient(input);
          navigate(`/clientes/${client.id}`);
        }}
      />
    </section>
  );
}
