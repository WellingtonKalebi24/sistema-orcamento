import { prisma } from "../config/prisma";

export class DocumentSequenceRepository {
  constructor(private readonly db = prisma) {}

  async next(type: "QUOTE" | "WORK_ORDER", prefix: "ORC" | "OS", date = new Date()) {
    const year = date.getFullYear();
    const record = await this.db.documentSequence.upsert({
      where: { type_year: { type, year } },
      update: { lastValue: { increment: 1 } },
      create: { type, year, lastValue: 1 },
    });

    return `${prefix}-${year}-${String(record.lastValue).padStart(5, "0")}`;
  }
}
