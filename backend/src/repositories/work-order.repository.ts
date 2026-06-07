import { prisma } from "../config/prisma";

export class WorkOrderRepository {
  constructor(private readonly db = prisma) {}

  list(filters: { page: number; pageSize: number; search?: string; status?: string }) {
    const where = {
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.search
        ? {
            OR: [
              { number: { contains: filters.search, mode: "insensitive" } },
              { client: { name: { contains: filters.search, mode: "insensitive" } } },
              { problemDescription: { contains: filters.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    return Promise.all([
      this.db.workOrder.findMany({
        where,
        include: {
          client: true,
          technician: true,
          quote: true,
          items: true,
          attachments: { where: { deletedAt: null } },
        },
        orderBy: { openedAt: "desc" },
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      this.db.workOrder.count({ where }),
    ]);
  }

  findById(id: string) {
    return this.db.workOrder.findUnique({
      where: { id },
      include: {
        client: true,
        technician: true,
        quote: true,
        items: true,
        attachments: { where: { deletedAt: null } },
      },
    });
  }

  findByQuoteId(quoteId: string) {
    return this.db.workOrder.findFirst({ where: { quoteId } });
  }

  create(data: object) {
    return this.db.workOrder.create({
      data,
      include: {
        client: true,
        technician: true,
        quote: true,
        items: true,
        attachments: { where: { deletedAt: null } },
      },
    });
  }

  update(id: string, data: object) {
    return this.db.workOrder.update({
      where: { id },
      data,
      include: {
        client: true,
        technician: true,
        quote: true,
        items: true,
        attachments: { where: { deletedAt: null } },
      },
    });
  }

  async replaceItems(id: string, items: object[]) {
    await this.db.workOrderItem.deleteMany({ where: { workOrderId: id } });
    return this.db.workOrder.update({
      where: { id },
      data: { items: { create: items } },
      include: {
        client: true,
        technician: true,
        quote: true,
        items: true,
        attachments: { where: { deletedAt: null } },
      },
    });
  }
}
