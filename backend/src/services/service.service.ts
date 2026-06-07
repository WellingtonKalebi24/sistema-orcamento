import { ServiceRepository } from "../repositories/service.repository";
import { AppError } from "../utils/app-error";
import type { ServiceInput, ServiceUpdateInput } from "../validators/service.schemas";

export class ServiceCatalogService {
  constructor(private readonly services = new ServiceRepository()) {}

  async list(filters: { page: number; pageSize: number; search?: string; status?: string }) {
    const [data, total] = await this.services.list(filters);
    return { data, meta: { ...filters, total } };
  }

  async findById(id: string) {
    const service = await this.services.findById(id);
    if (!service) throw AppError.notFound("Servico nao encontrado.");
    return service;
  }

  create(input: ServiceInput) {
    return this.services.create(input);
  }

  async update(id: string, input: ServiceUpdateInput) {
    await this.findById(id);
    return this.services.update(id, input);
  }

  async remove(id: string) {
    await this.findById(id);
    return this.services.softDelete(id);
  }
}
