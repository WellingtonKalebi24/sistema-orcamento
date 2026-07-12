import { useEffect, useState } from "react";

import type { CatalogService } from "../../../lib/api/schema";
import { getApiErrorMessage } from "../../../lib/api/errors";
import { formatCurrency } from "../../../lib/formatters/currency";
import { createService, deleteService, listServices, updateService } from "../api/services.api";
import { ServiceForm } from "../components/ServiceForm";

export function ServicesPage() {
  const [services, setServices] = useState<CatalogService[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [editingService, setEditingService] = useState<CatalogService>();

  function reload() {
    listServices()
      .then((data) => {
        setServices(data);
        setError("");
      })
      .catch(() => {
        setServices([]);
        setError("Nao foi possivel carregar os servicos.");
      });
  }

  useEffect(reload, []);

  return (
    <section className="panel">
      <p className="eyebrow">Servicos</p>
      <h2>Catalogo de servicos</h2>
      <ServiceForm
        key={editingService?.id ?? "new-service"}
        categories={Array.from(
          new Set(
            services
              .map((service) => service.category)
              .filter((value): value is string => Boolean(value)),
          ),
        ).sort()}
        service={editingService}
        onCancel={() => setEditingService(undefined)}
        onSubmit={async (input) => {
          if (editingService) await updateService(editingService.id, input);
          else await createService(input);
          setSuccess(
            editingService ? "Servico atualizado com sucesso." : "Servico salvo com sucesso.",
          );
          setEditingService(undefined);
          reload();
        }}
      />
      {error ? <p className="form-error">{error}</p> : null}
      {success ? <p className="success-message">{success}</p> : null}
      <div className="section-heading">
        <div>
          <h3>Servicos cadastrados</h3>
          <p>Escolha estes servicos ao montar um orcamento ou uma ordem.</p>
        </div>
        <span className="count-badge">{services.length}</span>
      </div>
      <div className="table-card">
        {services.length === 0 ? <p>Nenhum servico cadastrado.</p> : null}
        {services.map((service) => (
          <div className="table-row" key={service.id}>
            <strong>{service.name}</strong>
            <span>{service.category}</span>
            <span>{formatCurrency(service.defaultPrice)}</span>
            <div className="row-actions">
              <button
                className="button-secondary"
                type="button"
                onClick={() => {
                  setEditingService(service);
                  setError("");
                  setSuccess("");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                Editar
              </button>
              <button
                className="button-danger"
                type="button"
                onClick={async () => {
                  setError("");
                  try {
                    await deleteService(service.id);
                    setSuccess("Servico inativado. O historico foi preservado.");
                    reload();
                  } catch (caught) {
                    setError(getApiErrorMessage(caught, "Nao foi possivel inativar o servico."));
                  }
                }}
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
