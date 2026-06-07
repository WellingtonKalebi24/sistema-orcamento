import { DashboardRepository } from "../repositories/dashboard.repository";
import type { UserRole } from "../types/domain";

type QuoteLike = { status: string };
type WorkOrderLike = { status: string; estimatedProfit?: unknown };
type ProductLike = { stockQuantity: unknown; minimumStock: unknown };
type PaymentLike = { status: string; paidAmount: unknown };

function money(value: number) {
  return value.toFixed(2);
}

export class DashboardService {
  constructor(private readonly dashboard = new DashboardRepository()) {}

  async summary(role: UserRole) {
    const { quotes, workOrders, products, clients, payments } = await this.dashboard.summary();
    const paidPayments = payments.filter(
      (payment: PaymentLike) => payment.status === "PAGO" || payment.status === "PARCIAL",
    );
    const revenue = paidPayments.reduce(
      (total: number, payment: PaymentLike) => total + Number(payment.paidAmount),
      0,
    );
    const estimatedProfit = workOrders.reduce(
      (total: number, workOrder: WorkOrderLike) => total + Number(workOrder.estimatedProfit ?? 0),
      0,
    );
    const hideMoney = role === "TECNICO" || role === "ATENDENTE";

    return {
      cards: {
        quotesMonth: quotes.length,
        quotesApproved: quotes.filter((quote: QuoteLike) => quote.status === "APROVADO").length,
        quotesRejected: quotes.filter((quote: QuoteLike) => quote.status === "RECUSADO").length,
        monthlyRevenue: hideMoney ? null : money(revenue),
        estimatedProfit: hideMoney ? null : money(estimatedProfit),
        openWorkOrders: workOrders.filter((order: WorkOrderLike) => order.status === "ABERTA")
          .length,
        inProgressServices: workOrders.filter(
          (order: WorkOrderLike) => order.status === "EM_ANDAMENTO",
        ).length,
        lowStock: products.filter(
          (product: ProductLike) => Number(product.stockQuantity) <= Number(product.minimumStock),
        ).length,
        clients: clients.length,
      },
      revenueSeries: [{ month: "Atual", revenue: hideMoney ? 0 : revenue }],
      quoteStatus: ["RASCUNHO", "ENVIADO", "APROVADO", "RECUSADO", "EXPIRADO"].map((status) => ({
        status,
        total: quotes.filter((quote: QuoteLike) => quote.status === status).length,
      })),
      topProducts: products.slice(0, 5),
      latestQuotes: quotes.slice(0, 5),
      latestWorkOrders: workOrders.slice(0, 5),
    };
  }
}
