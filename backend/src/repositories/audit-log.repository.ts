import { prisma } from "../config/prisma";

export class AuditLogRepository {
  constructor(private readonly db = prisma) {}

  create(input: {
    actorId?: string | null;
    action: string;
    entityType?: string;
    entityId?: string;
    metadata?: unknown;
    requestId?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return this.db.auditLog.create({
      data: {
        actorId: input.actorId ?? null,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: input.metadata as object,
        requestId: input.requestId,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    });
  }
}
