import { prisma } from "../config/prisma";

export class QuoteRepository {
  constructor(private readonly db = prisma) {}

  list(filters: { page: number; pageSize: number; search?: string; status?: string }) {
    const where = {
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.search
        ? {
            OR: [
              { number: { contains: filters.search, mode: "insensitive" } },
              { client: { name: { contains: filters.search, mode: "insensitive" } } },
            ],
          }
        : {}),
    };

    return Promise.all([
      this.db.quote.findMany({
        where,
        include: { client: true, items: true },
        orderBy: { createdAt: "desc" },
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      this.db.quote.count({ where }),
    ]);
  }

  findById(id: string) {
    return this.db.quote.findUnique({ where: { id }, include: { client: true, items: true } });
  }

  create(data: object) {
    return this.db.quote.create({ data, include: { client: true, items: true } });
  }

  async replaceDraft(id: string, data: { quote: object; items: object[] }) {
    await this.db.quoteItem.deleteMany({ where: { quoteId: id } });
    return this.db.quote.update({
      where: { id },
      data: { ...data.quote, items: { create: data.items } },
      include: { client: true, items: true },
    });
  }

  updateStatus(id: string, data: object) {
    return this.db.quote.update({ where: { id }, data, include: { client: true, items: true } });
  }
}
