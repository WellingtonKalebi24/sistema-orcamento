import { prisma } from "../config/prisma";

export class ServiceRepository {
  constructor(private readonly db = prisma) {}

  listActive(search?: string) {
    return this.db.service.findMany({
      where: {
        status: "ACTIVE",
        deletedAt: null,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" } },
                { category: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { name: "asc" },
      take: 50,
    });
  }

  list(filters: { page: number; pageSize: number; search?: string; status?: string }) {
    const where = {
      deletedAt: null,
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.search
        ? {
            OR: [
              { name: { contains: filters.search, mode: "insensitive" } },
              { category: { contains: filters.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };
    return Promise.all([
      this.db.service.findMany({
        where,
        orderBy: { name: "asc" },
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      this.db.service.count({ where }),
    ]);
  }

  findActiveById(id: string) {
    return this.db.service.findFirst({ where: { id, status: "ACTIVE", deletedAt: null } });
  }

  findById(id: string) {
    return this.db.service.findFirst({ where: { id, deletedAt: null } });
  }

  create(data: object) {
    return this.db.service.create({ data });
  }

  update(id: string, data: object) {
    return this.db.service.update({ where: { id }, data });
  }

  softDelete(id: string) {
    return this.db.service.update({
      where: { id },
      data: { deletedAt: new Date(), status: "INACTIVE" },
    });
  }
}
