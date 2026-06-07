import { DashboardService } from "../../../src/services/dashboard.service";

describe("DashboardService", () => {
  it("redige valores financeiros para tecnico", async () => {
    const repository = {
      summary: jest.fn().mockResolvedValue({
        quotes: [{ status: "APROVADO" }],
        workOrders: [{ status: "ABERTA", estimatedProfit: "50.00" }],
        products: [{ stockQuantity: "1.000", minimumStock: "2.000" }],
        clients: [{}],
        payments: [{ status: "PAGO", paidAmount: "100.00" }],
      }),
    };
    const service = new DashboardService(repository as never);

    await expect(service.summary("TECNICO")).resolves.toMatchObject({
      cards: { monthlyRevenue: null, estimatedProfit: null, lowStock: 1 },
    });
  });
});
