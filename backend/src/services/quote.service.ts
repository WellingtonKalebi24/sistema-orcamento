import { DocumentSequenceRepository } from "../repositories/document-sequence.repository";
import { ProductRepository } from "../repositories/product.repository";
import { QuoteRepository } from "../repositories/quote.repository";
import { ServiceRepository } from "../repositories/service.repository";
import { ClientService } from "./client.service";
import { CompanySettingsService } from "./company-settings.service";
import { QuoteCalculatorService, type QuoteCalculationItem } from "./quote-calculator.service";
import { AppError } from "../utils/app-error";
import type { QuoteInput } from "../validators/quote.schemas";

export class QuoteService {
  constructor(
    private readonly quotes = new QuoteRepository(),
    private readonly clients = new ClientService(),
    private readonly products = new ProductRepository(),
    private readonly services = new ServiceRepository(),
    private readonly sequences = new DocumentSequenceRepository(),
    private readonly company = new CompanySettingsService(),
    private readonly calculator = new QuoteCalculatorService(),
  ) {}

  async list(filters: { page: number; pageSize: number; search?: string; status?: string }) {
    const [data, total] = await this.quotes.list(filters);
    return { data, meta: { ...filters, total } };
  }

  async findById(id: string) {
    const quote = await this.quotes.findById(id);
    if (!quote) throw AppError.notFound("Orcamento nao encontrado.");
    return quote;
  }

  async create(input: QuoteInput, userId: string) {
    const number = await this.sequences.next("QUOTE", "ORC");
    const prepared = await this.prepare(input);
    return this.quotes.create({
      number,
      clientId: input.clientId,
      validUntil: input.validUntil,
      requestDescription: input.requestDescription,
      notes: input.notes,
      paymentTerms: input.paymentTerms,
      executionDeadline: input.executionDeadline,
      ...prepared.totals,
      createdById: userId,
      updatedById: userId,
      items: { create: prepared.items },
    });
  }

  async updateDraft(id: string, input: QuoteInput, userId: string) {
    const current = await this.findById(id);
    if (current.status !== "RASCUNHO")
      throw AppError.conflict("Somente orcamentos em rascunho podem ser editados.");
    const prepared = await this.prepare(input);
    return this.quotes.replaceDraft(id, {
      quote: {
        clientId: input.clientId,
        validUntil: input.validUntil,
        requestDescription: input.requestDescription,
        notes: input.notes,
        paymentTerms: input.paymentTerms,
        executionDeadline: input.executionDeadline,
        ...prepared.totals,
        updatedById: userId,
      },
      items: prepared.items,
    });
  }

  async changeStatus(
    id: string,
    status: "ENVIADO" | "APROVADO" | "RECUSADO" | "EXPIRADO",
    userId: string,
  ) {
    const quote = await this.findById(id);
    const allowed: Record<string, string[]> = {
      RASCUNHO: ["ENVIADO"],
      ENVIADO: ["APROVADO", "RECUSADO", "EXPIRADO"],
      APROVADO: [],
      RECUSADO: [],
      EXPIRADO: [],
    };
    if (!allowed[quote.status]?.includes(status))
      throw AppError.conflict("Transicao de status invalida para o orcamento.");

    const snapshotData =
      status === "ENVIADO"
        ? {
            clientSnapshot: quote.client,
            companySnapshot: await this.company.getDefault(),
            snapshotAt: new Date(),
          }
        : {};

    return this.quotes.updateStatus(id, { status, updatedById: userId, ...snapshotData });
  }

  private async prepare(input: QuoteInput) {
    await this.clients.findById(input.clientId);

    const items: QuoteCalculationItem[] = [];
    for (const item of input.items) {
      if (item.type === "PRODUCT") {
        const product = await this.products.findActiveById(item.productId!);
        if (!product) throw AppError.notFound("Produto nao encontrado.");
        items.push({
          type: "PRODUCT",
          productId: product.id,
          descriptionSnapshot: product.name,
          unitSnapshot: product.unit,
          quantity: item.quantity,
          unitPrice: item.unitPrice ?? String(product.salePrice),
          unitCost: String(product.costPrice),
          discountAmount: item.discountAmount,
        });
      } else {
        const service = await this.services.findActiveById(item.serviceId!);
        if (!service) throw AppError.notFound("Servico nao encontrado.");
        items.push({
          type: "SERVICE",
          serviceId: service.id,
          descriptionSnapshot: service.name,
          quantity: item.quantity,
          unitPrice: item.unitPrice ?? String(service.defaultPrice),
          unitCost: "0.00",
          discountAmount: item.discountAmount,
        });
      }
    }

    const calculated = this.calculator.calculate({
      items,
      laborAmount: input.laborAmount,
      travelFee: input.travelFee,
      generalDiscount: input.generalDiscount,
    });

    return {
      totals: calculated.totals,
      items: calculated.items.map((calculatedItem) => {
        const { costTotal, ...item } = calculatedItem;
        void costTotal;
        return item;
      }),
    };
  }
}
