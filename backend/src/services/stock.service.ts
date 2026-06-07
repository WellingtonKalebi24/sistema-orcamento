import { CompanySettingsService } from "./company-settings.service";
import { ProductRepository } from "../repositories/product.repository";
import { StockMovementRepository } from "../repositories/stock-movement.repository";
import { AppError } from "../utils/app-error";

type StockWorkOrderItem = {
  id: string;
  type: "SERVICE" | "PRODUCT";
  productId?: string | null;
  descriptionSnapshot: string;
  usedQuantity: string;
};

function toNumber(value: unknown) {
  return Number(String(value ?? "0"));
}

function quantity(value: number) {
  return value.toFixed(3);
}

export class StockService {
  constructor(
    private readonly products = new ProductRepository(),
    private readonly movements = new StockMovementRepository(),
    private readonly company = new CompanySettingsService(),
  ) {}

  async deductWorkOrderItems(items: StockWorkOrderItem[], userId: string) {
    const settings = await this.company.getDefault();
    const allowNegative = Boolean(settings.allowNegativeStock);

    for (const item of items) {
      if (item.type !== "PRODUCT" || !item.productId) continue;
      const usedQuantity = toNumber(item.usedQuantity);
      if (usedQuantity <= 0) continue;

      const alreadyMoved = await this.movements.findByWorkOrderItemId(item.id);
      if (alreadyMoved) throw AppError.conflict("Estoque da ordem de servico ja foi baixado.");

      const product = await this.products.findActiveById(item.productId);
      if (!product) throw AppError.notFound("Produto da ordem de servico nao encontrado.");

      const previousBalance = toNumber(product.stockQuantity);
      const newBalance = previousBalance - usedQuantity;
      if (newBalance < 0 && !allowNegative) {
        throw new AppError(
          "INSUFFICIENT_STOCK",
          `Estoque insuficiente para ${item.descriptionSnapshot}.`,
          409,
          [
            {
              productId: item.productId,
              available: quantity(previousBalance),
              required: item.usedQuantity,
            },
          ],
        );
      }

      await this.movements.create({
        productId: item.productId,
        type: "WORK_ORDER",
        quantity: item.usedQuantity,
        previousBalance: quantity(previousBalance),
        newBalance: quantity(newBalance),
        reason: `Baixa automatica da ordem de servico`,
        workOrderItemId: item.id,
        createdById: userId,
      });
      await this.products.updateStock(item.productId, quantity(newBalance));
    }
  }
}
