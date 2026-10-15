import { WorkOrderPdfProvider } from "../providers/pdf/work-order-pdf.provider";
import { CompanySettingsService } from "./company-settings.service";
import { WorkOrderService } from "./work-order.service";

export class WorkOrderPdfService {
  constructor(
    private readonly orders = new WorkOrderService(),
    private readonly companySettings = new CompanySettingsService(),
    private readonly pdf = new WorkOrderPdfProvider(),
  ) {}

  async generate(id: string) {
    const order = await this.orders.findById(id);
    const company = await this.companySettings.getDefault();
    let logoBuffer: Buffer | undefined;
    if (company.logoAttachmentId) {
      try {
        logoBuffer = (await this.companySettings.downloadLogo()).buffer;
      } catch {
        /* A missing logo must not prevent printing a service order. */
      }
    }
    return {
      fileName: `ordem-servico-${order.number.replace(/[^a-zA-Z0-9_-]/g, "-")}.pdf`,
      buffer: await this.pdf.generate({ ...order, company, logoBuffer }),
    };
  }
}
