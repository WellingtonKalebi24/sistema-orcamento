import { prisma } from "../config/prisma";

export class CompanySettingsRepository {
  constructor(private readonly db = prisma) {}

  async getDefault() {
    const existing = await this.db.companySettings.findFirst({ include: { logoAttachment: true } });
    if (existing) return existing;
    return this.db.companySettings.create({
      data: {
        companyName: "Empresa",
        cnpj: "00000000000191",
        defaultPdfFooter: "Documento gerado pelo sistema.",
      },
      include: { logoAttachment: true },
    });
  }
}
