import type { Prisma } from "@prisma/client";
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
                { name: { contains: search, mode: "insensitive" as const } },
                { category: { contains: search, mode: "insensitive" as const } },
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
              { name: { contains: filters.search, mode: "insensitive" as const } },
              { category: { contains: filters.search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };
    return Promise.all([
      this.db.service.findMany({
        where: where as Prisma.ServiceWhereInput,
        orderBy: { name: "asc" },
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      this.db.service.count({ where: where as Prisma.ServiceWhereInput }),
    ]);
  }

  findActiveById(id: string) {
    return this.db.service.findFirst({ where: { id, status: "ACTIVE", deletedAt: null } });
  }

  findById(id: string) {
    return this.db.service.findFirst({ where: { id, deletedAt: null } });
  }

  create(data: object) {
    return this.db.service.create({ data: data as Prisma.ServiceUncheckedCreateInput });
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
