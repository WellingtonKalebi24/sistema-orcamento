import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export class ClientRepository {
  constructor(private readonly db = prisma) {}

  list(filters: { page: number; pageSize: number; search?: string }) {
    const where = filters.search
      ? {
          deletedAt: null,
          OR: [
            { name: { contains: filters.search, mode: "insensitive" as const } },
            { document: { contains: filters.search } },
          ],
        }
      : { deletedAt: null };
    return Promise.all([
      this.db.client.findMany({
        where: where as Prisma.ClientWhereInput,
        orderBy: { createdAt: "desc" },
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      this.db.client.count({ where: where as Prisma.ClientWhereInput }),
    ]);
  }

  findById(id: string) {
    return this.db.client.findFirst({ where: { id, deletedAt: null } });
  }

  findHistoryById(id: string) {
    return this.db.client.findFirst({
      where: { id, deletedAt: null },
      include: {
        quotes: {
          where: { deletedAt: null },
          include: { items: true },
          orderBy: { createdAt: "desc" },
        },
        workOrders: {
          where: { deletedAt: null },
          include: { items: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }

  findByDocument(document: string) {
    return this.db.client.findFirst({ where: { document, deletedAt: null } });
  }

  create(data: object) {
    return this.db.client.create({ data: data as Prisma.ClientUncheckedCreateInput });
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
