import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export class WorkOrderRepository {
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
              { problemDescription: { contains: filters.search, mode: "insensitive" as const } },
            ],
          }
        : {}),
    };

    return Promise.all([
      this.db.workOrder.findMany({
        where: where as Prisma.WorkOrderWhereInput,
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
      this.db.workOrder.count({ where: where as Prisma.WorkOrderWhereInput }),
    ]);
  }

  findById(id: string) {
    return this.db.workOrder.findUnique({
      where: { id, deletedAt: null },
      include: {
        client: true,
        payments: true,
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
      data: data as Prisma.WorkOrderUncheckedCreateInput,
      include: {
        client: true,
        payments: true,
        technician: true,
        quote: true,
        items: true,
        attachments: { where: { deletedAt: null } },
      },
    });
  }

  update(id: string, data: object) {
    return this.db.workOrder.update({
      where: {
        id,
        deletedAt: null,
        ...("deletedAt" in data
          ? { status: { not: "CONCLUIDA" as const }, stockDeductedAt: null, payments: { none: {} } }
          : {}),
      },
      data,
      include: {
        client: true,
        payments: true,
        technician: true,
        quote: true,
        items: true,
        attachments: { where: { deletedAt: null } },
      },
    });
  }

  async replaceItems(id: string, items: object[], data: object = {}) {
    return this.db.$transaction(async (tx) => {
      await tx.workOrderItem.deleteMany({ where: { workOrderId: id } });
      return tx.workOrder.update({
        where: {
          id,
          deletedAt: null,
          status: { notIn: ["CONCLUIDA", "CANCELADA"] },
          stockDeductedAt: null,
          payments: { none: {} },
        },
        data: {
          ...data,
          items: { create: items as Prisma.WorkOrderItemUncheckedCreateWithoutWorkOrderInput[] },
        },
        include: {
          client: true,
          payments: true,
          technician: true,
          quote: true,
          items: true,
          attachments: { where: { deletedAt: null } },
        },
      });
    });
  }
}
