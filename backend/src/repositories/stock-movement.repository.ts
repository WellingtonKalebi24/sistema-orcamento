import { prisma } from "../config/prisma";

export class StockMovementRepository {
  constructor(private readonly db = prisma) {}

  findByWorkOrderItemId(workOrderItemId: string) {
    return this.db.stockMovement.findFirst({ where: { workOrderItemId } });
  }

  create(data: object) {
    return this.db.stockMovement.create({ data });
  }

  listByProduct(productId: string) {
    return this.db.stockMovement.findMany({ where: { productId }, orderBy: { createdAt: "desc" } });
  }
}
