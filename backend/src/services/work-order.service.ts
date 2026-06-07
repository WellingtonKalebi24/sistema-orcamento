import { ClientService } from "./client.service";
import { QuoteService } from "./quote.service";
import { DocumentSequenceRepository } from "../repositories/document-sequence.repository";
import { ProductRepository } from "../repositories/product.repository";
import { ServiceRepository } from "../repositories/service.repository";
import { UserRepository } from "../repositories/user.repository";
import { WorkOrderRepository } from "../repositories/work-order.repository";
import type { WorkOrderStatus } from "../types/domain";
import { AppError } from "../utils/app-error";
import type {
  WorkOrderConversionInput,
  WorkOrderInput,
  WorkOrderItemInput,
  WorkOrderUpdateInput,
} from "../validators/work-order.schemas";

type PreparedItem = {
  type: "SERVICE" | "PRODUCT";
  productId?: string;
  serviceId?: string;
  descriptionSnapshot: string;
  unitSnapshot?: string;
  plannedQuantity: string;
  usedQuantity: string;
  unitPrice: string;
  unitCost: string;
  totalPrice: string;
  totalCost: string;
};

type QuoteItemRecord = {
  type: "SERVICE" | "PRODUCT";
  productId?: string | null;
  serviceId?: string | null;
  descriptionSnapshot: string;
  unitSnapshot?: string | null;
  quantity: string;
  unitPrice: string;
  unitCost: string;
  total: string;
};

function money(value: number) {
  return value.toFixed(2);
}

function multiply(quantity: string, price: string) {
  return Number(quantity) * Number(price);
}

function sum(items: PreparedItem[], field: "totalCost" | "totalPrice") {
  return items.reduce((total, item) => total + Number(item[field]), 0);
}

export class WorkOrderService {
  constructor(
    private readonly workOrders = new WorkOrderRepository(),
    private readonly clients = new ClientService(),
    private readonly products = new ProductRepository(),
    private readonly services = new ServiceRepository(),
    private readonly users = new UserRepository(),
    private readonly sequences = new DocumentSequenceRepository(),
    private readonly quotes = new QuoteService(),
  ) {}

  async list(filters: { page: number; pageSize: number; search?: string; status?: string }) {
    const [data, total] = await this.workOrders.list(filters);
    return { data, meta: { ...filters, total } };
  }

  async findById(id: string) {
    const workOrder = await this.workOrders.findById(id);
    if (!workOrder) throw AppError.notFound("Ordem de servico nao encontrada.");
    return workOrder;
  }

  async create(input: WorkOrderInput, userId: string) {
    await this.clients.findById(input.clientId);
    await this.ensureTechnician(input.technicianId);

    const items = await this.prepareItems(input.items);
    const chargedAmount =
      input.chargedAmount === "0.00" ? money(sum(items, "totalPrice")) : input.chargedAmount;
    const totalCost = money(sum(items, "totalCost") + Number(input.laborCost));
    const number = await this.sequences.next("WORK_ORDER", "OS");

    return this.workOrders.create({
      number,
      clientId: input.clientId,
      technicianId: input.technicianId,
      expectedAt: input.expectedAt,
      problemDescription: input.problemDescription,
      executionDescription: input.executionDescription,
      internalNotes: input.internalNotes,
      clientNotes: input.clientNotes,
      laborCost: input.laborCost,
      chargedAmount,
      totalCost,
      estimatedProfit: money(Number(chargedAmount) - Number(totalCost)),
      createdById: userId,
      updatedById: userId,
      items: { create: items },
    });
  }

  async convertFromQuote(quoteId: string, input: WorkOrderConversionInput, userId: string) {
    const quote = await this.quotes.findById(quoteId);
    if (quote.status !== "APROVADO") {
      throw AppError.conflict("Somente orcamento aprovado pode gerar ordem de servico.");
    }
    if (await this.workOrders.findByQuoteId(quoteId)) {
      throw AppError.conflict("Este orcamento ja possui ordem de servico.");
    }
    await this.ensureTechnician(input.technicianId);

    const items = (quote.items as QuoteItemRecord[]).map((item) => ({
      type: item.type,
      productId: item.productId ?? undefined,
      serviceId: item.serviceId ?? undefined,
      descriptionSnapshot: item.descriptionSnapshot,
      unitSnapshot: item.unitSnapshot ?? undefined,
      plannedQuantity: String(item.quantity),
      usedQuantity: item.type === "PRODUCT" ? String(item.quantity) : "0.000",
      unitPrice: String(item.unitPrice),
      unitCost: String(item.unitCost),
      totalPrice: String(item.total),
      totalCost: money(multiply(String(item.quantity), String(item.unitCost))),
    }));

    const number = await this.sequences.next("WORK_ORDER", "OS");
    return this.workOrders.create({
      number,
      clientId: quote.clientId,
      quoteId,
      technicianId: input.technicianId,
      expectedAt: input.expectedAt,
      problemDescription: quote.requestDescription,
      clientNotes: quote.notes,
      chargedAmount: String(quote.totalAmount),
      totalCost: String(quote.estimatedCost),
      estimatedProfit: String(quote.estimatedProfit),
      createdById: userId,
      updatedById: userId,
      items: { create: items },
    });
  }

  async update(id: string, input: WorkOrderUpdateInput, userId: string) {
    const current = await this.findById(id);
    if (current.status === "CONCLUIDA") {
      throw AppError.conflict("Ordem de servico concluida nao pode ser editada livremente.");
    }
    if (current.status === "CANCELADA") {
      throw AppError.conflict("Ordem de servico cancelada nao pode ser editada livremente.");
    }
    if (input.status) this.ensureTransition(current.status, input.status);
    await this.ensureTechnician(input.technicianId);

    const updateData: Record<string, unknown> = {
      technicianId: input.technicianId,
      expectedAt: input.expectedAt,
      problemDescription: input.problemDescription,
      executionDescription: input.executionDescription,
      internalNotes: input.internalNotes,
      clientNotes: input.clientNotes,
      laborCost: input.laborCost,
      chargedAmount: input.chargedAmount,
      status: input.status,
      updatedById: userId,
    };
    Object.keys(updateData).forEach(
      (key) => updateData[key] === undefined && delete updateData[key],
    );

    const items = input.items ? await this.prepareItems(input.items) : undefined;
    if (items) {
      const chargedAmount = input.chargedAmount ?? money(sum(items, "totalPrice"));
      const laborCost = input.laborCost ?? String(current.laborCost ?? "0.00");
      const totalCost = money(sum(items, "totalCost") + Number(laborCost));
      Object.assign(updateData, {
        chargedAmount,
        totalCost,
        estimatedProfit: money(Number(chargedAmount) - Number(totalCost)),
      });
    }

    const updated = await this.workOrders.update(id, updateData);
    return items ? this.workOrders.replaceItems(updated.id, items) : updated;
  }

  private ensureTransition(from: WorkOrderStatus, to: WorkOrderStatus) {
    const allowed: Record<WorkOrderStatus, WorkOrderStatus[]> = {
      ABERTA: ["EM_ANDAMENTO", "AGUARDANDO_PECA", "CANCELADA"],
      EM_ANDAMENTO: ["AGUARDANDO_PECA", "CANCELADA"],
      AGUARDANDO_PECA: ["EM_ANDAMENTO", "CANCELADA"],
      CONCLUIDA: [],
      CANCELADA: [],
    };
    if (from === to) return;
    if (!allowed[from]?.includes(to)) {
      throw AppError.conflict("Transicao de status invalida para a ordem de servico.");
    }
  }

  private async ensureTechnician(technicianId?: string) {
    if (!technicianId) return;
    const user = await this.users.findActiveById(technicianId);
    if (!user || user.role !== "TECNICO")
      throw AppError.notFound("Tecnico responsavel nao encontrado.");
  }

  private async prepareItems(inputItems: WorkOrderItemInput[]): Promise<PreparedItem[]> {
    const items: PreparedItem[] = [];
    for (const item of inputItems) {
      if (item.type === "PRODUCT") {
        const product = await this.products.findActiveById(item.productId!);
        if (!product) throw AppError.notFound("Produto nao encontrado.");
        const unitPrice = item.unitPrice ?? String(product.salePrice);
        const unitCost = item.unitCost ?? String(product.costPrice);
        items.push({
          type: "PRODUCT",
          productId: product.id,
          descriptionSnapshot: product.name,
          unitSnapshot: product.unit,
          plannedQuantity: item.plannedQuantity,
          usedQuantity: item.usedQuantity === "0.000" ? item.plannedQuantity : item.usedQuantity,
          unitPrice,
          unitCost,
          totalPrice: money(multiply(item.plannedQuantity, unitPrice)),
          totalCost: money(
            multiply(
              item.usedQuantity === "0.000" ? item.plannedQuantity : item.usedQuantity,
              unitCost,
            ),
          ),
        });
      } else {
        const service = await this.services.findActiveById(item.serviceId!);
        if (!service) throw AppError.notFound("Servico nao encontrado.");
        const unitPrice = item.unitPrice ?? String(service.defaultPrice);
        items.push({
          type: "SERVICE",
          serviceId: service.id,
          descriptionSnapshot: service.name,
          plannedQuantity: item.plannedQuantity,
          usedQuantity: item.usedQuantity,
          unitPrice,
          unitCost: item.unitCost ?? "0.00",
          totalPrice: money(multiply(item.plannedQuantity, unitPrice)),
          totalCost: money(multiply(item.usedQuantity, item.unitCost ?? "0.00")),
        });
      }
    }
    return items;
  }
}
