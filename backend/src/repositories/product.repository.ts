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
                { name: { contains: search, mode: "insensitive" } },
                { sku: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { name: "asc" },
      take: 50,
    });
  }

  findActiveById(id: string) {
    return this.db.product.findFirst({ where: { id, status: "ACTIVE", deletedAt: null } });
  }

  create(data: object) {
    return this.db.product.create({ data });
  }
}
