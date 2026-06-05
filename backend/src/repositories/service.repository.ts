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

  findActiveById(id: string) {
    return this.db.service.findFirst({ where: { id, status: "ACTIVE", deletedAt: null } });
  }

  create(data: object) {
    return this.db.service.create({ data });
  }
}
