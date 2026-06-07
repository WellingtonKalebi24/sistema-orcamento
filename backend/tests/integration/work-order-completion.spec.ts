import { AppError } from "../../src/utils/app-error";
import { WorkOrderCompletionService } from "../../src/services/work-order-completion.service";
import { StockService } from "../../src/services/stock.service";

function completionService(
  workOrder: Record<string, unknown>,
  stock = { deductWorkOrderItems: jest.fn() },
) {
  const workOrders = {
    findById: jest.fn().mockResolvedValue(workOrder),
    update: jest.fn().mockImplementation((_id: string, data: unknown) => Promise.resolve(data)),
  };
  return {
    service: new WorkOrderCompletionService(workOrders as never, stock as never),
    workOrders,
    stock,
  };
}

describe("Conclusao de ordem de servico e estoque", () => {
  it("conclui OS aberta uma unica vez e aciona baixa de estoque", async () => {
    const { service, workOrders, stock } = completionService({
      id: "work-order-id",
      status: "ABERTA",
      stockDeductedAt: null,
      items: [{ id: "item-id", type: "PRODUCT", productId: "product-id", usedQuantity: "1.000" }],
    });

    await expect(service.complete("work-order-id", {}, "user-id")).resolves.toMatchObject({
      status: "CONCLUIDA",
    });
    expect(stock.deductWorkOrderItems).toHaveBeenCalledTimes(1);
    expect(workOrders.update).toHaveBeenCalledWith(
      "work-order-id",
      expect.objectContaining({ status: "CONCLUIDA" }),
    );
  });

  it("bloqueia reprocessamento idempotente quando estoque ja foi baixado", async () => {
    const { service, stock } = completionService({
      id: "work-order-id",
      status: "CONCLUIDA",
      stockDeductedAt: new Date(),
      items: [],
    });

    await expect(service.complete("work-order-id", {}, "user-id")).rejects.toThrow(
      "ja foi concluida",
    );
    expect(stock.deductWorkOrderItems).not.toHaveBeenCalled();
  });

  it("propaga estoque insuficiente sem marcar a OS como concluida", async () => {
    const stock = {
      deductWorkOrderItems: jest
        .fn()
        .mockRejectedValue(new AppError("INSUFFICIENT_STOCK", "Estoque insuficiente", 409)),
    };
    const { service, workOrders } = completionService(
      { id: "work-order-id", status: "EM_ANDAMENTO", stockDeductedAt: null, items: [] },
      stock,
    );

    await expect(service.complete("work-order-id", {}, "user-id")).rejects.toThrow(
      "Estoque insuficiente",
    );
    expect(workOrders.update).not.toHaveBeenCalled();
  });
});

describe("StockService", () => {
  it("bloqueia estoque negativo quando configuracao nao permite", async () => {
    const products = {
      findActiveById: jest.fn().mockResolvedValue({
        id: "product-id",
        name: "Peca",
        stockQuantity: "0.000",
      }),
      updateStock: jest.fn(),
    };
    const movements = {
      findByWorkOrderItemId: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
    };
    const company = { getDefault: jest.fn().mockResolvedValue({ allowNegativeStock: false }) };
    const service = new StockService(products as never, movements as never, company as never);

    await expect(
      service.deductWorkOrderItems(
        [
          {
            id: "item-id",
            type: "PRODUCT",
            productId: "product-id",
            descriptionSnapshot: "Peca",
            usedQuantity: "1.000",
          },
        ],
        "user-id",
      ),
    ).rejects.toThrow("Estoque insuficiente");
    expect(movements.create).not.toHaveBeenCalled();
  });

  it("registra movimento e permite saldo negativo quando configuracao autoriza", async () => {
    const products = {
      findActiveById: jest.fn().mockResolvedValue({
        id: "product-id",
        name: "Peca",
        stockQuantity: "0.000",
      }),
      updateStock: jest.fn(),
    };
    const movements = {
      findByWorkOrderItemId: jest.fn().mockResolvedValue(null),
      create: jest.fn(),
    };
    const company = { getDefault: jest.fn().mockResolvedValue({ allowNegativeStock: true }) };
    const service = new StockService(products as never, movements as never, company as never);

    await service.deductWorkOrderItems(
      [
        {
          id: "item-id",
          type: "PRODUCT",
          productId: "product-id",
          descriptionSnapshot: "Peca",
          usedQuantity: "1.000",
        },
      ],
      "user-id",
    );

    expect(movements.create).toHaveBeenCalledWith(
      expect.objectContaining({ newBalance: "-1.000" }),
    );
    expect(products.updateStock).toHaveBeenCalledWith("product-id", "-1.000");
  });
});
