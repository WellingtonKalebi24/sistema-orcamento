import { prisma } from "../config/prisma";

export class AttachmentRepository {
  constructor(private readonly db = prisma) {}

  listByWorkOrder(workOrderId: string) {
    return this.db.attachment.findMany({
      where: { workOrderId, deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  }

  findById(id: string) {
    return this.db.attachment.findFirst({ where: { id, deletedAt: null } });
  }

  create(data: object) {
    return this.db.attachment.create({ data });
  }

  softDelete(id: string) {
    return this.db.attachment.update({ where: { id }, data: { deletedAt: new Date() } });
  }
}
