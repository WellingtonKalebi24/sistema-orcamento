import { prisma } from "../config/prisma";

export class StockMovementRepository {
  constructor(private readonly db = prisma) {}

  findByWorkOrderItemId(workOrderItemId: string) {
    return this.db.stockMovement.findFirst({ where: { workOrderItemId } });
  }

  create(data: object) {
    return this.db.stockMovement.create({ data });
  }

  list(filters: { page: number; pageSize: number; productId?: string }) {
    const where = filters.productId ? { productId: filters.productId } : {};
    return Promise.all([
      this.db.stockMovement.findMany({
        where,
        include: { product: true },
        orderBy: { createdAt: "desc" },
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      this.db.stockMovement.count({ where }),
    ]);
  }

  listByProduct(productId: string) {
    return this.db.stockMovement.findMany({ where: { productId }, orderBy: { createdAt: "desc" } });
  }
}
