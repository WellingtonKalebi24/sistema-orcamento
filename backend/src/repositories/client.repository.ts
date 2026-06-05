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

  findByDocument(document: string) {
    return this.db.client.findFirst({ where: { document, deletedAt: null } });
  }

  create(data: object) {
    return this.db.client.create({ data });
  }
}
