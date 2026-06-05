import { prisma } from "../config/prisma";
import type { UserRole } from "../types/domain";

export class UserRepository {
  constructor(private readonly db = prisma) {}

  findByEmail(email: string) {
    return this.db.user.findFirst({ where: { email, deletedAt: null } });
  }

  findActiveById(id: string) {
    return this.db.user.findFirst({ where: { id, status: "ACTIVE", deletedAt: null } });
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
}
