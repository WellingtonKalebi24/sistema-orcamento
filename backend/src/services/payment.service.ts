import { PaymentRepository } from "../repositories/payment.repository";
import { QuoteRepository } from "../repositories/quote.repository";
import { WorkOrderRepository } from "../repositories/work-order.repository";
import { AppError } from "../utils/app-error";
import type { PaymentInput, PaymentUpdateInput } from "../validators/payment.schemas";

type PaymentStatus = "PENDENTE" | "PARCIAL" | "PAGO" | "CANCELADO";

function deriveStatus(
  amount: string,
  paidAmount: string,
  requested?: PaymentStatus,
): PaymentStatus {
  if (requested === "CANCELADO") return "CANCELADO";
  const amountNumber = Number(amount);
  const paidNumber = Number(paidAmount);
  if (paidNumber <= 0) return "PENDENTE";
  if (paidNumber < amountNumber) return "PARCIAL";
  return "PAGO";
}

export class PaymentService {
  constructor(
    private readonly payments = new PaymentRepository(),
    private readonly quotes = new QuoteRepository(),
    private readonly workOrders = new WorkOrderRepository(),
  ) {}

  async list(filters: { page: number; pageSize: number; status?: string }) {
    const [data, total] = await this.payments.list(filters);
    return { data, meta: { ...filters, total } };
  }

  async create(input: PaymentInput, userId: string) {
    await this.ensureTarget(input);
    return this.payments.create({
      ...input,
      status: deriveStatus(input.amount, input.paidAmount),
      paidAt: input.paidAmount !== "0.00" && !input.paidAt ? new Date() : input.paidAt,
      createdById: userId,
      updatedById: userId,
    });
  }

  async update(id: string, input: PaymentUpdateInput, userId: string) {
    const current = await this.payments.findById(id);
    if (!current) throw AppError.notFound("Pagamento nao encontrado.");
    const amount = input.amount ?? String(current.amount);
    const paidAmount = input.paidAmount ?? String(current.paidAmount);
    return this.payments.update(id, {
      ...input,
      status: deriveStatus(amount, paidAmount, input.status),
      paidAt:
        paidAmount !== "0.00" && !input.paidAt ? (current.paidAt ?? new Date()) : input.paidAt,
      updatedById: userId,
    });
  }

  private async ensureTarget(input: Partial<PaymentInput>) {
    if (input.quoteId && !(await this.quotes.findById(input.quoteId))) {
      throw AppError.notFound("Orcamento vinculado nao encontrado.");
    }
    if (input.workOrderId && !(await this.workOrders.findById(input.workOrderId))) {
      throw AppError.notFound("Ordem de servico vinculada nao encontrada.");
    }
  }
}
