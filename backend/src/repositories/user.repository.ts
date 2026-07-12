import { prisma } from "../config/prisma";
import type { UserRole } from "../types/domain";

export class UserRepository {
  constructor(private readonly db = prisma) {}

  list(filters: {
    page: number;
    pageSize: number;
    search?: string;
    role?: string;
    status?: string;
  }) {
    const where = {
      deletedAt: null,
      ...(filters.role ? { role: filters.role } : {}),
      ...(filters.status ? { status: filters.status } : {}),
      ...(filters.search
        ? {
            OR: [
              { name: { contains: filters.search, mode: "insensitive" } },
              { email: { contains: filters.search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    return Promise.all([
      this.db.user.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (filters.page - 1) * filters.pageSize,
        take: filters.pageSize,
      }),
      this.db.user.count({ where }),
    ]);
  }

  findByEmail(email: string) {
    return this.db.user.findFirst({ where: { email, deletedAt: null } });
  }

  findActiveById(id: string) {
    return this.db.user.findFirst({ where: { id, status: "ACTIVE", deletedAt: null } });
  }

  findById(id: string) {
    return this.db.user.findFirst({ where: { id, deletedAt: null } });
  }

  create(input: { name: string; email: string; passwordHash: string; role: UserRole }) {
    return this.db.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash: input.passwordHash,
        role: input.role,
      },
    });
  }

  updateLastLogin(id: string) {
    return this.db.user.update({ where: { id }, data: { lastLoginAt: new Date() } });
  }

  update(id: string, data: object) {
    return this.db.user.update({ where: { id }, data });
  }

  softDelete(id: string) {
    return this.db.user.update({
      where: { id },
      data: { status: "INACTIVE", deletedAt: new Date() },
    });
  }
}
