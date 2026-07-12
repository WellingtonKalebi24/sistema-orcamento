import { DashboardRepository } from "../repositories/dashboard.repository";
import type { UserRole } from "../types/domain";

type QuoteLike = {
  id: string;
  number: string;
  status: string;
  totalAmount?: unknown;
  client?: { name?: string } | null;
};
type WorkOrderLike = {
  id: string;
  number: string;
  status: string;
  chargedAmount?: unknown;
  totalCost?: unknown;
  estimatedProfit?: unknown;
  client?: { name?: string } | null;
};
type ProductLike = {
  id: string;
  name: string;
  stockQuantity: unknown;
  minimumStock: unknown;
};
type ClientLike = { id: string; name: string; document?: string };
type PaymentLike = {
  id: string;
  status: string;
  paidAmount: unknown;
  amount?: unknown;
  quoteId?: string | null;
  workOrderId?: string | null;
};

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
    const profitWorkOrders = workOrders.filter(
      (workOrder: WorkOrderLike) => workOrder.status !== "CANCELADA",
    );
    const estimatedProfit = profitWorkOrders.reduce(
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
      details: {
        quotesMonth: quotes.map((quote: QuoteLike) => ({
          id: quote.id,
          number: quote.number,
          client: quote.client?.name ?? "Cliente",
          status: quote.status,
          amount: money(Number(quote.totalAmount ?? 0)),
        })),
        quotesApproved: quotes
          .filter((quote: QuoteLike) => quote.status === "APROVADO")
          .map((quote: QuoteLike) => ({
            id: quote.id,
            number: quote.number,
            client: quote.client?.name ?? "Cliente",
            status: quote.status,
            amount: money(Number(quote.totalAmount ?? 0)),
          })),
        monthlyRevenue: paidPayments.map((payment: PaymentLike) => ({
          id: payment.id,
          documentId: payment.workOrderId ?? payment.quoteId,
          status: payment.status,
          paidAmount: money(Number(payment.paidAmount)),
          amount: money(Number(payment.amount ?? 0)),
        })),
        estimatedProfit: profitWorkOrders.map((workOrder: WorkOrderLike) => ({
          id: workOrder.id,
          number: workOrder.number,
          client: workOrder.client?.name ?? "Cliente",
          status: workOrder.status,
          chargedAmount: money(Number(workOrder.chargedAmount ?? 0)),
          totalCost: money(Number(workOrder.totalCost ?? 0)),
          estimatedProfit: money(Number(workOrder.estimatedProfit ?? 0)),
        })),
        openWorkOrders: workOrders
          .filter((order: WorkOrderLike) => order.status === "ABERTA")
          .map((order: WorkOrderLike) => ({
            id: order.id,
            number: order.number,
            client: order.client?.name ?? "Cliente",
            status: order.status,
          })),
        inProgressServices: workOrders
          .filter((order: WorkOrderLike) => order.status === "EM_ANDAMENTO")
          .map((order: WorkOrderLike) => ({
            id: order.id,
            number: order.number,
            client: order.client?.name ?? "Cliente",
            status: order.status,
          })),
        lowStock: products
          .filter(
            (product: ProductLike) => Number(product.stockQuantity) <= Number(product.minimumStock),
          )
          .map((product: ProductLike) => ({
            id: product.id,
            name: product.name,
            stockQuantity: String(product.stockQuantity),
            minimumStock: String(product.minimumStock),
          })),
        clients: clients.map((client: ClientLike) => ({
          id: client.id,
          name: client.name,
          document: client.document,
        })),
      },
    };
  }
}
