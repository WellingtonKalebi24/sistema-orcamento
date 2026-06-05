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

  async findById(id: string) {
    const client = await this.clients.findById(id);
    if (!client) throw AppError.notFound("Cliente nao encontrado.");
    return client;
  }
}
