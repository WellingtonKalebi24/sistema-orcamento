import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export class ProductRepository {
  constructor(private readonly db = prisma) {}

  listActive(search?: string) {
    return this.db.product.findMany({
      where: {
        status: "ACTIVE",
        deletedAt: null,
        ...(search
          ? {
              OR: [
                { name: { contains: search, mode: "insensitive" as const } },
                { sku: { contains: search, mode: "insensitive" as const } },
              ],
            }
          : {}),
      },
      orderBy: { name: "asc" },
      take: 50,
    });
  }

  list(filters: {
    page: number;
    pageSize: number;
    search?: string;
    status?: string;
    lowStock?: boolean;
  }) {
    const where = {
      deletedAt: null,
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.search
        ? {
            OR: [
              { name: { contains: filters.search, mode: "insensitive" as const } },
              { sku: { contains: filters.search, mode: "insensitive" as const } },
              { category: { contains: filters.search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };
    return Promise.all([
      this.db.product.findMany({
        where: where as Prisma.ProductWhereInput,
        orderBy: { name: "asc" },
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      this.db.product.count({ where: where as Prisma.ProductWhereInput }),
    ]);
  }

  findActiveById(id: string) {
    return this.db.product.findFirst({ where: { id, status: "ACTIVE", deletedAt: null } });
  }

  findById(id: string) {
    return this.db.product.findFirst({ where: { id, deletedAt: null } });
  }

  create(data: object) {
    return this.db.product.create({ data: data as Prisma.ProductUncheckedCreateInput });
  }

  updateStock(id: string, stockQuantity: string) {
    return this.db.product.update({ where: { id }, data: { stockQuantity } });
  }

  update(id: string, data: object) {
    return this.db.product.update({ where: { id }, data });
  }

  softDelete(id: string) {
    return this.db.product.update({
      where: { id },
      data: { deletedAt: new Date(), status: "INACTIVE" },
    });
  }
}
