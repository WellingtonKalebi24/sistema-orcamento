import { prisma } from "../config/prisma";

export class RefreshTokenRepository {
  constructor(private readonly db = prisma) {}

  create(input: { userId: string; familyId: string; tokenHash: string; expiresAt: Date }) {
    return this.db.refreshToken.create({ data: input });
  }

  findValidByHash(tokenHash: string) {
    return this.db.refreshToken.findFirst({
      where: {
        tokenHash,
        revokedAt: null,
        expiresAt: { gt: new Date() },
      },
      include: { user: true },
    });
  }

  async rotate(
    id: string,
    replacement: { userId: string; tokenHash: string; expiresAt: Date; familyId: string },
  ) {
    const now = new Date();
    await this.db.refreshToken.update({ where: { id }, data: { revokedAt: now, replacedAt: now } });
    return this.db.refreshToken.create({ data: replacement });
  }

  revoke(tokenHash: string) {
    return this.db.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
}
