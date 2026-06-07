import { ClientRepository } from "../repositories/client.repository";
import { AppError } from "../utils/app-error";
import type { ClientInput } from "../validators/client.schemas";

export class ClientService {
  constructor(private readonly clients = new ClientRepository()) {}

  async list(filters: { page: number; pageSize: number; search?: string }) {
    const [data, total] = await this.clients.list(filters);
    return { data, meta: { ...filters, total } };
  }

  async create(input: ClientInput) {
    const existing = await this.clients.findByDocument(input.document);
    if (existing) throw AppError.conflict("CPF/CNPJ ja cadastrado.");
    return this.clients.create({ ...input, email: input.email || null });
  }

  async update(id: string, input: Partial<ClientInput>) {
    const current = await this.findById(id);
    if (input.document && input.document !== current.document) {
      const existing = await this.clients.findByDocument(input.document);
      if (existing) throw AppError.conflict("CPF/CNPJ ja cadastrado.");
    }
    return this.clients.update(id, { ...input, email: input.email || null });
  }

  async findById(id: string) {
    const client = await this.clients.findById(id);
    if (!client) throw AppError.notFound("Cliente nao encontrado.");
    return client;
  }

  async history(id: string) {
    const client = await this.clients.findHistoryById(id);
    if (!client) throw AppError.notFound("Cliente nao encontrado.");
    return client;
  }

  async remove(id: string) {
    await this.findById(id);
    return this.clients.softDelete(id);
  }
}
