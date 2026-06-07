import { prisma } from "../config/prisma";

export class ClientRepository {
  constructor(private readonly db = prisma) {}

  list(filters: { page: number; pageSize: number; search?: string }) {
    const where = filters.search
      ? {
          deletedAt: null,
          OR: [
            { name: { contains: filters.search, mode: "insensitive" } },
            { document: { contains: filters.search } },
          ],
        }
      : { deletedAt: null };
    return Promise.all([
      this.db.client.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      this.db.client.count({ where }),
    ]);
  }

  findById(id: string) {
    return this.db.client.findFirst({ where: { id, deletedAt: null } });
  }

  findHistoryById(id: string) {
    return this.db.client.findFirst({
      where: { id, deletedAt: null },
      include: {
        quotes: { include: { items: true }, orderBy: { createdAt: "desc" }, take: 20 },
        workOrders: { include: { items: true }, orderBy: { createdAt: "desc" }, take: 20 },
      },
    });
  }

  findByDocument(document: string) {
    return this.db.client.findFirst({ where: { document, deletedAt: null } });
  }

  create(data: object) {
    return this.db.client.create({ data });
  }

  update(id: string, data: object) {
    return this.db.client.update({ where: { id }, data });
  }

  softDelete(id: string) {
    return this.db.client.update({
      where: { id },
      data: { deletedAt: new Date(), status: "INACTIVE" },
    });
  }
}
