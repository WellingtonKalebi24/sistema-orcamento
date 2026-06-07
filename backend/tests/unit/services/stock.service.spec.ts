import { AppError } from "../../../src/utils/app-error";
import { StockService } from "../../../src/services/stock.service";

function makeStockService(allowNegativeStock = false, stockQuantity = "5.000") {
  const products = {
    findById: jest.fn().mockResolvedValue({ id: "product-id", stockQuantity }),
    findActiveById: jest.fn(),
    updateStock: jest.fn(),
  };
  const movements = {
    list: jest.fn(),
    create: jest.fn().mockResolvedValue({ id: "movement-id" }),
    findByWorkOrderItemId: jest.fn(),
  };
  const company = { getDefault: jest.fn().mockResolvedValue({ allowNegativeStock }) };
  return {
    service: new StockService(products as never, movements as never, company as never),
    products,
    movements,
  };
}

describe("StockService movimentos manuais", () => {
  it("registra entrada somando saldo e historico", async () => {
    const { service, products, movements } = makeStockService(false, "5.000");

    await service.createManualMovement(
      "product-id",
      { type: "ENTRY", quantity: "2.000", reason: "Compra" },
      "user-id",
    );

    expect(products.updateStock).toHaveBeenCalledWith("product-id", "7.000");
    expect(movements.create).toHaveBeenCalledWith(
      expect.objectContaining({ previousBalance: "5.000", newBalance: "7.000" }),
    );
  });

  it("bloqueia saida sem saldo quando estoque negativo esta desabilitado", async () => {
    const { service, products } = makeStockService(false, "1.000");

    await expect(
      service.createManualMovement(
        "product-id",
        { type: "EXIT", quantity: "2.000", reason: "Uso manual" },
        "user-id",
      ),
    ).rejects.toBeInstanceOf(AppError);
    expect(products.updateStock).not.toHaveBeenCalled();
  });
});
