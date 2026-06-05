import { prisma } from "../../src/config/prisma";

export async function resetDatabase() {
  await prisma.$transaction([
    prisma.stockMovement.deleteMany(),
    prisma.quoteItem.deleteMany(),
    prisma.quote.deleteMany(),
    prisma.product.deleteMany(),
    prisma.service.deleteMany(),
    prisma.client.deleteMany(),
    prisma.refreshToken.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}

export { prisma as testPrisma };
