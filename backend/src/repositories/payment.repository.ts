import type { Prisma } from "@prisma/client";
import { prisma } from "../config/prisma";

export class PaymentRepository {
  constructor(private readonly db = prisma) {}

  list(filters: { page: number; pageSize: number; status?: string }) {
    const where = filters.status ? { status: filters.status } : {};
    return Promise.all([
      this.db.payment.findMany({
        where: where as Prisma.PaymentWhereInput,
        include: { quote: true, workOrder: true },
        orderBy: { createdAt: "desc" },
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      this.db.payment.count({ where: where as Prisma.PaymentWhereInput }),
    ]);
  }

  findById(id: string) {
    return this.db.payment.findUnique({ where: { id }, include: { quote: true, workOrder: true } });
  }

  create(data: object) {
    return this.db.payment.create({
      data: data as Prisma.PaymentUncheckedCreateInput,
      include: { quote: true, workOrder: true },
    });
  }

  update(id: string, data: object) {
    return this.db.payment.update({
      where: { id },
      data,
      include: { quote: true, workOrder: true },
    });
  }
}
