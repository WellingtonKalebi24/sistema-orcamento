import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("Admin@12345", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@sistema.local" },
    update: {},
    create: {
      name: "Administrador",
      email: "admin@sistema.local",
      passwordHash,
      role: "ADMIN",
    },
  });

  await prisma.companySettings.upsert({
    where: { id: "00000000-0000-0000-0000-000000000001" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000001",
      companyName: "Empresa de Manutencao",
      cnpj: "00000000000191",
      phone: "(11) 3333-3333",
      whatsapp: "(11) 99999-9999",
      email: "contato@empresa.local",
      address: "Rua Exemplo, 100 - Sao Paulo/SP",
      pixKey: "contato@empresa.local",
      defaultQuoteText: "Obrigado por solicitar seu orcamento.",
      defaultPdfFooter: "Atendimento em horario comercial.",
    },
  });

  await prisma.client.upsert({
    where: { id: "00000000-0000-0000-0000-000000000101" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000101",
      name: "Cliente Demonstracao",
      personType: "PF",
      document: "12345678909",
      phone: "(11) 2222-2222",
      whatsapp: "(11) 98888-8888",
      email: "cliente@example.com",
      city: "Sao Paulo",
      state: "SP",
      notes: "Cliente inicial para demonstracao.",
    },
  });

  await prisma.service.upsert({
    where: { id: "00000000-0000-0000-0000-000000000201" },
    update: {},
    create: {
      id: "00000000-0000-0000-0000-000000000201",
      name: "Diagnostico tecnico",
      description: "Avaliacao inicial do equipamento ou ambiente.",
      category: "Assistencia tecnica",
      defaultPrice: "120.00",
      estimatedMinutes: 60,
    },
  });

  await prisma.product.upsert({
    where: { sku: "PEC-DEMO-001" },
    update: {},
    create: {
      name: "Peca demonstracao",
      sku: "PEC-DEMO-001",
      category: "Reposicao",
      supplier: "Fornecedor Demo",
      unit: "UN",
      stockQuantity: "10.000",
      minimumStock: "2.000",
      costPrice: "35.00",
      salePrice: "75.00",
    },
  });

  await prisma.auditLog.create({
    data: {
      actorId: admin.id,
      action: "CREATE",
      entityType: "Seed",
      entityId: "initial",
      metadata: { message: "Seed inicial executado." },
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
