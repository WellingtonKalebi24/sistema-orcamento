import { CompanySettingsService } from "./company-settings.service";
import { ProductRepository } from "../repositories/product.repository";
import { StockMovementRepository } from "../repositories/stock-movement.repository";
import { AppError } from "../utils/app-error";
import type { StockMovementInput } from "../validators/stock.schemas";

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

  async list(filters: { page: number; pageSize: number; productId?: string }) {
    const [data, total] = await this.movements.list(filters);
    return { data, meta: { ...filters, total } };
  }

  async createManualMovement(productId: string, input: StockMovementInput, userId: string) {
    const product = await this.products.findById(productId);
    if (!product) throw AppError.notFound("Produto nao encontrado.");

    const previousBalance = toNumber(product.stockQuantity);
    const movementQuantity = toNumber(input.quantity);
    const newBalance =
      input.type === "ENTRY"
        ? previousBalance + movementQuantity
        : input.type === "EXIT"
          ? previousBalance - movementQuantity
          : movementQuantity;

    const settings = await this.company.getDefault();
    if (newBalance < 0 && !settings.allowNegativeStock) {
      throw new AppError("INSUFFICIENT_STOCK", "Estoque insuficiente para movimentacao.", 409);
    }

    const movement = await this.movements.create({
      productId,
      type: input.type,
      quantity: input.quantity,
      previousBalance: quantity(previousBalance),
      newBalance: quantity(newBalance),
      reason: input.reason,
      createdById: userId,
    });
    await this.products.updateStock(productId, quantity(newBalance));
    return movement;
  }
}
