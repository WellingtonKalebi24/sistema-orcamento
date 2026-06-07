import { useEffect, useState } from "react";

import type { CatalogService } from "../../../lib/api/schema";
import { formatCurrency } from "../../../lib/formatters/currency";
import { createService, deleteService, listServices } from "../api/services.api";
import { ServiceForm } from "../components/ServiceForm";

export function ServicesPage() {
  const [services, setServices] = useState<CatalogService[]>([]);

  function reload() {
    listServices()
      .then(setServices)
      .catch(() => setServices([]));
  }

  useEffect(reload, []);

  return (
    <section className="panel">
      <p className="eyebrow">Servicos</p>
      <h2>Catalogo de servicos</h2>
      <ServiceForm
        onSubmit={async (input) => {
          await createService(input);
          reload();
        }}
      />
      <div className="table-card">
        {services.map((service) => (
          <div className="table-row" key={service.id}>
            <strong>{service.name}</strong>
            <span>{service.category}</span>
            <span>{formatCurrency(service.defaultPrice)}</span>
            <button
              className="button-secondary"
              type="button"
              onClick={() => deleteService(service.id).then(reload)}
            >
              Inativar
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
