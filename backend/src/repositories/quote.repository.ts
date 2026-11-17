import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export class QuoteRepository {
  constructor(private readonly db = prisma) {}

  list(filters: { page: number; pageSize: number; search?: string; status?: string }) {
    const where = {
      deletedAt: null,
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.search
        ? {
            OR: [
              { number: { contains: filters.search, mode: "insensitive" as const } },
              { client: { name: { contains: filters.search, mode: "insensitive" as const } } },
            ],
          }
        : {}),
    };

    return Promise.all([
      this.db.quote.findMany({
        where: where as Prisma.QuoteWhereInput,
        include: { client: true, items: true, workOrder: true, payments: true },
        orderBy: { createdAt: "desc" },
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      this.db.quote.count({ where: where as Prisma.QuoteWhereInput }),
    ]);
  }

  findById(id: string) {
    return this.db.quote.findUnique({
      where: { id, deletedAt: null },
      include: { client: true, items: true, workOrder: true, payments: true },
    });
  }

  create(data: object) {
    return this.db.quote.create({
      data: data as Prisma.QuoteUncheckedCreateInput,
      include: { client: true, items: true, workOrder: true, payments: true },
    });
  }

  async replaceDraft(id: string, data: { quote: object; items: object[] }) {
    return this.db.$transaction(async (tx) => {
      await tx.quoteItem.deleteMany({ where: { quoteId: id } });
      return tx.quote.update({
        where: { id, deletedAt: null, workOrder: { is: null }, payments: { none: {} } },
        data: {
          ...data.quote,
          items: { create: data.items as Prisma.QuoteItemUncheckedCreateWithoutQuoteInput[] },
        },
        include: { client: true, items: true, workOrder: true, payments: true },
      });
    });
  }

  updateStatus(id: string, data: object) {
    return this.db.quote.update({
      where: {
        id,
        deletedAt: null,
        ...("deletedAt" in data ? { workOrder: { is: null }, payments: { none: {} } } : {}),
      },
      data,
      include: { client: true, items: true, workOrder: true, payments: true },
    });
  }
}
