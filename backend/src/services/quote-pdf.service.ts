import { QuotePdfProvider } from "../providers/pdf/quote-pdf.provider";
import { LocalStorageProvider } from "../providers/storage/local-storage.provider";
import { AttachmentRepository } from "../repositories/attachment.repository";
import { CompanySettingsService } from "./company-settings.service";
import { QuoteService } from "./quote.service";

export class QuotePdfService {
  constructor(
    private readonly quotes = new QuoteService(),
    private readonly pdf = new QuotePdfProvider(),
    private readonly attachments = new AttachmentRepository(),
    private readonly storage = new LocalStorageProvider(),
    private readonly companySettings = new CompanySettingsService(),
  ) {}

  async generate(id: string) {
    const quote = await this.quotes.findById(id);
    const currentCompany = await this.companySettings.getDefault();
    const company = (quote.companySnapshot ?? {}) as { logoAttachmentId?: string };
    const logoAttachmentId = company.logoAttachmentId ?? currentCompany.logoAttachmentId;
    let logoBuffer: Buffer | undefined;

    if (logoAttachmentId) {
      const attachment = await this.attachments.findById(logoAttachmentId);
      if (attachment) {
        try {
          logoBuffer = await this.storage.read(attachment.storageKey);
        } catch {
          logoBuffer = undefined;
        }
      }
    }

    return {
      fileName: `orcamento-${quote.number}.pdf`,
      buffer: await this.pdf.generate({
        ...quote,
        itemsSubtotal: String(quote.itemsSubtotal),
        laborAmount: String(quote.laborAmount),
        travelFee: String(quote.travelFee),
        totalDiscount: String(quote.totalDiscount),
        totalAmount: String(quote.totalAmount),
        clientSnapshot: quote.clientSnapshot as Record<string, unknown> | null,
        items: quote.items.map((item) => ({
          ...item,
          quantity: String(item.quantity),
          unitPrice: String(item.unitPrice),
          total: String(item.total),
        })),
        companySnapshot: (quote.companySnapshot ?? currentCompany) as Record<string, unknown>,
        logoBuffer,
      }),
    };
  }
}
