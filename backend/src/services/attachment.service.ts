import { LocalStorageProvider } from "../providers/storage/local-storage.provider";
import type { StorageProvider } from "../providers/storage/storage-provider";
import { AttachmentRepository } from "../repositories/attachment.repository";
import { WorkOrderRepository } from "../repositories/work-order.repository";
import { AppError } from "../utils/app-error";

export class AttachmentService {
  constructor(
    private readonly attachments = new AttachmentRepository(),
    private readonly workOrders = new WorkOrderRepository(),
    private readonly storage: StorageProvider = new LocalStorageProvider(),
  ) {}

  async listByWorkOrder(workOrderId: string) {
    const workOrder = await this.workOrders.findById(workOrderId);
    if (!workOrder) throw AppError.notFound("Ordem de servico nao encontrada.");
    return this.attachments.listByWorkOrder(workOrderId);
  }

  async upload(
    workOrderId: string,
    file: Express.Multer.File | undefined,
    input: { type: "WORK_ORDER_PHOTO" | "WORK_ORDER_DOCUMENT" | "CLIENT_ACCEPTANCE" },
    userId: string,
  ) {
    const workOrder = await this.workOrders.findById(workOrderId);
    if (!workOrder) throw AppError.notFound("Ordem de servico nao encontrada.");
    if (!file) throw AppError.validation("Arquivo obrigatorio.");

    const stored = await this.storage.save({
      buffer: file.buffer,
      originalName: file.originalname,
      mimeType: file.mimetype,
    });

    return this.attachments.create({
      type: input.type,
      workOrderId,
      storageKey: stored.storageKey,
      originalName: stored.originalName,
      mimeType: stored.mimeType,
      sizeBytes: stored.sizeBytes,
      uploadedById: userId,
    });
  }

  async download(id: string) {
    const attachment = await this.attachments.findById(id);
    if (!attachment) throw AppError.notFound("Anexo nao encontrado.");
    return { attachment, buffer: await this.storage.read(attachment.storageKey) };
  }

  async remove(id: string) {
    const attachment = await this.attachments.findById(id);
    if (!attachment) throw AppError.notFound("Anexo nao encontrado.");
    await this.storage.remove(attachment.storageKey);
    return this.attachments.softDelete(id);
  }
}
