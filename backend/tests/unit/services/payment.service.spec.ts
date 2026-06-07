import { PaymentService } from "../../../src/services/payment.service";

function makeService() {
  const payments = {
    list: jest.fn(),
    findById: jest.fn(),
    create: jest.fn().mockImplementation((data: unknown) => Promise.resolve(data)),
    update: jest.fn(),
  };
  const quotes = { findById: jest.fn().mockResolvedValue({ id: "quote-id" }) };
  const workOrders = { findById: jest.fn().mockResolvedValue({ id: "work-order-id" }) };
  return {
    service: new PaymentService(payments as never, quotes as never, workOrders as never),
    payments,
  };
}

describe("PaymentService", () => {
  it("deriva pagamento pendente, parcial e pago pelo valor recebido", async () => {
    const { service, payments } = makeService();

    await service.create(
      { workOrderId: "work-order-id", method: "PIX", amount: "100.00", paidAmount: "40.00" },
      "user-id",
    );

    expect(payments.create).toHaveBeenCalledWith(expect.objectContaining({ status: "PARCIAL" }));
  });

  it("mantem cancelamento solicitado", async () => {
    const { service, payments } = makeService();
    payments.findById.mockResolvedValue({
      id: "payment-id",
      amount: "100.00",
      paidAmount: "100.00",
    });
    payments.update.mockImplementation((_id: string, data: unknown) => Promise.resolve(data));

    await expect(
      service.update("payment-id", { status: "CANCELADO" }, "user-id"),
    ).resolves.toMatchObject({
      status: "CANCELADO",
    });
  });
});
