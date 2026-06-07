import { WorkOrderService } from "../../../src/services/work-order.service";

const approvedQuote = {
  id: "quote-id",
  clientId: "client-id",
  status: "APROVADO",
  requestDescription: "Troca de peca",
  notes: "Cliente prefere periodo da tarde",
  totalAmount: "250.00",
  estimatedCost: "50.00",
  estimatedProfit: "200.00",
  items: [
    {
      type: "PRODUCT",
      productId: "product-id",
      serviceId: null,
      descriptionSnapshot: "Peca",
      unitSnapshot: "UN",
      quantity: "1.000",
      unitPrice: "250.00",
      unitCost: "50.00",
      total: "250.00",
    },
  ],
};

function makeService(overrides: Record<string, unknown> = {}) {
  const workOrders = {
    list: jest.fn(),
    findById: jest.fn(),
    findByQuoteId: jest.fn().mockResolvedValue(null),
    create: jest.fn().mockImplementation((data: unknown) => Promise.resolve(data)),
    update: jest.fn(),
    replaceItems: jest.fn(),
    ...overrides,
  };
  const clients = { findById: jest.fn().mockResolvedValue({ id: "client-id" }) };
  const products = { findActiveById: jest.fn() };
  const services = { findActiveById: jest.fn() };
  const users = { findActiveById: jest.fn() };
  const sequences = { next: jest.fn().mockResolvedValue("OS-2026-00001") };
  const quotes = { findById: jest.fn().mockResolvedValue(approvedQuote) };

  return new WorkOrderService(
    workOrders as never,
    clients as never,
    products as never,
    services as never,
    users as never,
    sequences as never,
    quotes as never,
  );
}

describe("WorkOrderService", () => {
  it("bloqueia conversao duplicada de orcamento aprovado", async () => {
    const service = makeService({
      findByQuoteId: jest.fn().mockResolvedValue({ id: "work-order-id" }),
    });

    await expect(service.convertFromQuote("quote-id", {}, "user-id")).rejects.toThrow(
      "Este orcamento ja possui ordem de servico.",
    );
  });

  it("bloqueia edicao livre de ordem concluida", async () => {
    const service = makeService({
      findById: jest.fn().mockResolvedValue({ id: "work-order-id", status: "CONCLUIDA" }),
    });

    await expect(
      service.update("work-order-id", { internalNotes: "Nova nota" }, "user-id"),
    ).rejects.toThrow("concluida nao pode ser editada");
  });

  it("bloqueia transicao direta para concluida pelo endpoint de atualizacao", async () => {
    const service = makeService({
      findById: jest.fn().mockResolvedValue({ id: "work-order-id", status: "ABERTA" }),
    });

    await expect(
      service.update("work-order-id", { status: "CONCLUIDA" } as never, "user-id"),
    ).rejects.toThrow("Transicao de status invalida");
  });
});
