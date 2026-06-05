import { AuditLogRepository } from "../repositories/audit-log.repository";

export class AuditService {
  constructor(private readonly auditLogRepository = new AuditLogRepository()) {}

  record(input: Parameters<AuditLogRepository["create"]>[0]) {
    return this.auditLogRepository.create(input);
  }
}
