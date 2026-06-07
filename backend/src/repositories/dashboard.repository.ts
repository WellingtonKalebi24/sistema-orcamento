import { prisma } from "../config/prisma";

export class DashboardRepository {
  constructor(private readonly db = prisma) {}

  async summary() {
    const [quotes, workOrders, products, clients, payments] = await Promise.all([
      this.db.quote.findMany({ include: { client: true, items: true } }),
      this.db.workOrder.findMany({ include: { client: true, items: true } }),
      this.db.product.findMany({ where: { deletedAt: null } }),
      this.db.client.findMany({ where: { deletedAt: null } }),
      this.db.payment.findMany({}),
    ]);
    return { quotes, workOrders, products, clients, payments };
  }
}
