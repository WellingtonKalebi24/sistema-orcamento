import { LocalStorageProvider } from "../providers/storage/local-storage.provider";
import type { StorageProvider } from "../providers/storage/storage-provider";
import { AttachmentRepository } from "../repositories/attachment.repository";
import { CompanySettingsRepository } from "../repositories/company-settings.repository";
import { AppError } from "../utils/app-error";
import type { CompanySettingsInput } from "../validators/company-settings.schemas";

export class CompanySettingsService {
  constructor(
    private readonly settings = new CompanySettingsRepository(),
    private readonly attachments = new AttachmentRepository(),
    private readonly storage: StorageProvider = new LocalStorageProvider(),
  ) {}

  getDefault() {
    return this.settings.getDefault();
  }

  async getBranding() {
    const current = await this.getDefault();
    return {
      companyName: current.companyName,
      systemName: "systemName" in current ? current.systemName : "Sistema OS",
      primaryColor: "primaryColor" in current ? current.primaryColor : "#245dde",
      sidebarColor: "sidebarColor" in current ? current.sidebarColor : "#12233e",
      hasLogo: Boolean(current.logoAttachmentId),
    };
  }

  async update(input: CompanySettingsInput) {
    const current = await this.getDefault();
    return this.settings.update(current.id, { ...input, email: input.email || null });
  }

  async uploadLogo(file: Express.Multer.File | undefined, userId: string) {
    if (!file) throw AppError.validation("Logo obrigatoria.");
    if (!["image/png", "image/jpeg", "image/webp"].includes(file.mimetype)) {
      throw AppError.validation("Logo deve ser PNG, JPG ou WebP.");
    }
    const current = await this.getDefault();
    const stored = await this.storage.save({
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
    });
    const attachment = await this.attachments.create({
      type: "COMPANY_LOGO",
      storageKey: stored.storageKey,
      originalName: stored.originalName,
      mimeType: stored.mimeType,
      sizeBytes: stored.sizeBytes,
      uploadedById: userId,
    });
    return this.settings.update(current.id, { logoAttachmentId: attachment.id });
  }

  async downloadLogo() {
    const current = await this.getDefault();
    if (!current.logoAttachment) throw AppError.notFound("Logo da empresa nao cadastrada.");
    return {
      attachment: current.logoAttachment,
      buffer: await this.storage.read(current.logoAttachment.storageKey),
    };
  }
}
