import { DashboardRepository } from "../repositories/dashboard.repository";

type ProductReport = {
  id: string;
  name: string;
  sku: string;
  stockQuantity: unknown;
  minimumStock: unknown;
};

export class ReportService {
  constructor(private readonly dashboard = new DashboardRepository()) {}

  async summary() {
    const data = await this.dashboard.summary();
    return {
      quotes: data.quotes,
      workOrders: data.workOrders,
      payments: data.payments,
      stock: data.products.map((product: ProductReport) => ({
        id: product.id,
        name: product.name,
        sku: product.sku,
        stockQuantity: product.stockQuantity,
        minimumStock: product.minimumStock,
        lowStock: Number(product.stockQuantity) <= Number(product.minimumStock),
      })),
    };
  }
}
