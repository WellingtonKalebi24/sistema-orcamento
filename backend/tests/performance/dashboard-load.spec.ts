import { DashboardService } from "../../src/services/dashboard.service";

describe("Dashboard performance baseline", () => {
  it("agrega resumo dentro do limite do MVP com dataset pequeno", async () => {
    const repository = {
      summary: jest.fn().mockResolvedValue({
        quotes: Array.from({ length: 100 }, () => ({ status: "APROVADO" })),
        workOrders: Array.from({ length: 100 }, () => ({
          status: "CONCLUIDA",
          estimatedProfit: "10.00",
        })),
        products: Array.from({ length: 100 }, () => ({
          stockQuantity: "5.000",
          minimumStock: "1.000",
        })),
        clients: Array.from({ length: 100 }, () => ({})),
        payments: Array.from({ length: 100 }, () => ({ status: "PAGO", paidAmount: "20.00" })),
      }),
    };
    const service = new DashboardService(repository as never);
    const startedAt = performance.now();

    await service.summary("ADMIN");

    expect(performance.now() - startedAt).toBeLessThan(3000);
  });
});
