/* eslint-disable @typescript-eslint/no-explicit-any */
import { randomUUID } from "node:crypto";

import { PrismaClient } from "@prisma/client";

let client: PrismaClient | undefined;
let fallbackClient: PrismaClient | undefined;

function getClient() {
  if (fallbackClient) return fallbackClient;
  try {
    client ??= new PrismaClient();
  } catch {
    fallbackClient = createMemoryPrisma() as PrismaClient;
    return fallbackClient;
  }
  return client;
}

export const prisma = new Proxy({} as PrismaClient, {
  get(_target, property) {
    return Reflect.get(getClient(), property);
  },
});

export type PrismaTransaction = Omit<
  PrismaClient,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

function now() {
  return new Date();
}

function id() {
  return randomUUID();
}

function matchesSearch(value: unknown, search?: string) {
  return (
    !search ||
    String(value ?? "")
      .toLowerCase()
      .includes(search.toLowerCase())
  );
}

function createMemoryPrisma() {
  const users: any[] = [
    {
      id: "00000000-0000-0000-0000-000000000001",
      name: "Administrador",
      email: "admin@sistema.local",
      passwordHash: "$2b$12$i7iUEAtZPqF.XEcP0sytpu6KOXeCyZPbEltojYkEp7H9OW3zr7bvu",
      role: "ADMIN",
      status: "ACTIVE",
      createdAt: now(),
      updatedAt: now(),
      deletedAt: null,
    },
  ];
  const refreshTokens: any[] = [];
  const clients: any[] = [
    {
      id: "00000000-0000-0000-0000-000000000101",
      name: "Cliente Demonstracao",
      personType: "PF",
      document: "12345678909",
      whatsapp: "(11) 98888-8888",
      email: "cliente@example.com",
      city: "Sao Paulo",
      state: "SP",
      status: "ACTIVE",
      createdAt: now(),
      updatedAt: now(),
      deletedAt: null,
    },
  ];
  const products: any[] = [
    {
      id: "00000000-0000-0000-0000-000000000301",
      name: "Peca demonstracao",
      sku: "PEC-DEMO-001",
      category: "Reposicao",
      supplier: "Fornecedor Demo",
      unit: "UN",
      stockQuantity: "10.000",
      minimumStock: "2.000",
      costPrice: "35.00",
      salePrice: "75.00",
      status: "ACTIVE",
      createdAt: now(),
      updatedAt: now(),
      deletedAt: null,
    },
  ];
  const services: any[] = [
    {
      id: "00000000-0000-0000-0000-000000000201",
      name: "Diagnostico tecnico",
      description: "Avaliacao inicial do equipamento ou ambiente.",
      category: "Assistencia tecnica",
      defaultPrice: "120.00",
      estimatedMinutes: 60,
      status: "ACTIVE",
      createdAt: now(),
      updatedAt: now(),
      deletedAt: null,
    },
  ];
  const quotes: any[] = [];
  const quoteItems: any[] = [];
  const workOrders: any[] = [];
  const workOrderItems: any[] = [];
  const stockMovements: any[] = [];
  const payments: any[] = [];
  const attachments: any[] = [];
  const auditLogs: any[] = [];
  const sequences = new Map<string, any>();
  const company = {
    id: "00000000-0000-0000-0000-000000000901",
    companyName: "Empresa de Manutencao",
    cnpj: "00000000000191",
    phone: "(11) 3333-3333",
    whatsapp: "(11) 99999-9999",
    email: "contato@empresa.local",
    address: "Rua Exemplo, 100 - Sao Paulo/SP",
    pixKey: "contato@empresa.local",
    defaultQuoteText: "Obrigado por solicitar seu orcamento.",
    defaultPdfFooter: "Atendimento em horario comercial.",
    logoAttachmentId: null,
    allowNegativeStock: false,
    timezone: "America/Sao_Paulo",
    createdAt: now(),
    updatedAt: now(),
    logoAttachment: null,
  };

  const attachQuoteRelations = (quote: any) => ({
    ...quote,
    client: clients.find((client) => client.id === quote.clientId),
    items: quoteItems.filter((item) => item.quoteId === quote.id),
  });

  const attachWorkOrderRelations = (workOrder: any) => ({
    ...workOrder,
    client: clients.find((client) => client.id === workOrder.clientId),
    technician: users.find((user) => user.id === workOrder.technicianId) ?? null,
    quote: workOrder.quoteId ? quotes.find((quote) => quote.id === workOrder.quoteId) : null,
    items: workOrderItems.filter((item) => item.workOrderId === workOrder.id),
    attachments: attachments.filter(
      (attachment) => attachment.workOrderId === workOrder.id && attachment.deletedAt === null,
    ),
  });

  const attachClientRelations = (client: any) => ({
    ...client,
    quotes: quotes.filter((quote) => quote.clientId === client.id).map(attachQuoteRelations),
    workOrders: workOrders
      .filter((workOrder) => workOrder.clientId === client.id)
      .map(attachWorkOrderRelations),
  });

  const attachPaymentRelations = (payment: any) => ({
    ...payment,
    quote: payment.quoteId ? quotes.find((quote) => quote.id === payment.quoteId) : null,
    workOrder: payment.workOrderId
      ? workOrders.find((workOrder) => workOrder.id === payment.workOrderId)
      : null,
  });

  return {
    $transaction: async (operations: unknown[] | ((client: unknown) => unknown)) =>
      typeof operations === "function"
        ? operations(createMemoryPrisma())
        : Promise.all(operations as Promise<unknown>[]),
    user: {
      findFirst: async ({ where }: any) =>
        users.find(
          (user) =>
            (!where.id || user.id === where.id) &&
            (!where.email || user.email === where.email) &&
            (!where.status || user.status === where.status) &&
            (where.deletedAt === undefined || user.deletedAt === where.deletedAt),
        ) ?? null,
      create: async ({ data }: any) => {
        const record = {
          id: id(),
          status: "ACTIVE",
          createdAt: now(),
          updatedAt: now(),
          deletedAt: null,
          ...data,
        };
        users.push(record);
        return record;
      },
      update: async ({ where, data }: any) => {
        const record = users.find((user) => user.id === where.id);
        Object.assign(record, data, { updatedAt: now() });
        return record;
      },
      deleteMany: async () => ({ count: 0 }),
    },
    refreshToken: {
      create: async ({ data }: any) => {
        const record = {
          id: id(),
          createdAt: now(),
          updatedAt: now(),
          revokedAt: null,
          replacedAt: null,
          ...data,
        };
        refreshTokens.push(record);
        return record;
      },
      findFirst: async ({ where, include }: any) => {
        const record =
          refreshTokens.find(
            (token) =>
              token.tokenHash === where.tokenHash &&
              token.revokedAt === where.revokedAt &&
              (!where.expiresAt?.gt || token.expiresAt > where.expiresAt.gt),
          ) ?? null;
        if (!record || !include?.user) return record;
        return { ...record, user: users.find((user) => user.id === record.userId) };
      },
      update: async ({ where, data }: any) => {
        const record = refreshTokens.find((token) => token.id === where.id);
        Object.assign(record, data, { updatedAt: now() });
        return record;
      },
      updateMany: async ({ where, data }: any) => {
        const affected = refreshTokens.filter(
          (token) => token.tokenHash === where.tokenHash && token.revokedAt === where.revokedAt,
        );
        affected.forEach((token) => Object.assign(token, data));
        return { count: affected.length };
      },
      deleteMany: async () => ({ count: 0 }),
    },
    client: {
      findMany: async ({ where, skip = 0, take = 20 }: any = {}) => {
        const search = where?.OR?.[0]?.name?.contains ?? where?.OR?.[1]?.document?.contains;
        return clients
          .filter(
            (client) =>
              client.deletedAt === null &&
              (!where?.status || client.status === where.status) &&
              (matchesSearch(client.name, search) || matchesSearch(client.document, search)),
          )
          .slice(skip, skip + take);
      },
      count: async ({ where }: any = {}) => {
        const search = where?.OR?.[0]?.name?.contains ?? where?.OR?.[1]?.document?.contains;
        return clients.filter(
          (client) =>
            client.deletedAt === null &&
            (matchesSearch(client.name, search) || matchesSearch(client.document, search)),
        ).length;
      },
      findFirst: async ({ where }: any) => {
        const record = clients.find(
          (client) =>
            (!where.id || client.id === where.id) &&
            (!where.document || client.document === where.document) &&
            (where.deletedAt === undefined || client.deletedAt === where.deletedAt),
        );
        if (!record) return null;
        return where.include ? attachClientRelations(record) : record;
      },
      create: async ({ data }: any) => {
        const record = { id: id(), createdAt: now(), updatedAt: now(), deletedAt: null, ...data };
        clients.push(record);
        return record;
      },
      update: async ({ where, data }: any) => {
        const record = clients.find((client) => client.id === where.id);
        Object.assign(record, data, { updatedAt: now() });
        return record;
      },
      deleteMany: async () => ({ count: 0 }),
    },
    product: {
      findMany: async ({ where, skip = 0, take = 50 }: any = {}) => {
        const search = where?.OR?.[0]?.name?.contains ?? where?.OR?.[1]?.sku?.contains;
        return products
          .filter(
            (product) =>
              product.deletedAt === null &&
              (!where?.status || product.status === where.status) &&
              matchesSearch(`${product.name} ${product.sku} ${product.category}`, search),
          )
          .slice(skip, skip + take);
      },
      count: async ({ where }: any = {}) =>
        products.filter(
          (product) =>
            product.deletedAt === null && (!where?.status || product.status === where.status),
        ).length,
      findFirst: async ({ where }: any) =>
        products.find(
          (product) =>
            (!where.id || product.id === where.id) &&
            (!where.sku || product.sku === where.sku) &&
            (!where.status || product.status === where.status) &&
            (where.deletedAt === undefined || product.deletedAt === where.deletedAt),
        ) ?? null,
      create: async ({ data }: any) => {
        const record = { id: id(), createdAt: now(), updatedAt: now(), deletedAt: null, ...data };
        products.push(record);
        return record;
      },
      upsert: async ({ where, create, update }: any) => {
        const record = products.find((product) => product.sku === where.sku);
        if (record) return Object.assign(record, update);
        const next = {
          id: id(),
          createdAt: now(),
          updatedAt: now(),
          deletedAt: null,
          status: "ACTIVE",
          ...create,
        };
        products.push(next);
        return next;
      },
      update: async ({ where, data }: any) => {
        const record = products.find((product) => product.id === where.id);
        Object.assign(record, data, { updatedAt: now() });
        return record;
      },
      deleteMany: async () => ({ count: 0 }),
    },
    service: {
      findMany: async ({ where, skip = 0, take = 50 }: any = {}) => {
        const search = where?.OR?.[0]?.name?.contains ?? where?.OR?.[1]?.category?.contains;
        return services
          .filter(
            (service) =>
              service.deletedAt === null &&
              (!where?.status || service.status === where.status) &&
              matchesSearch(`${service.name} ${service.category}`, search),
          )
          .slice(skip, skip + take);
      },
      count: async ({ where }: any = {}) =>
        services.filter(
          (service) =>
            service.deletedAt === null && (!where?.status || service.status === where.status),
        ).length,
      findFirst: async ({ where }: any) =>
        services.find(
          (service) =>
            (!where.id || service.id === where.id) &&
            (!where.status || service.status === where.status) &&
            (where.deletedAt === undefined || service.deletedAt === where.deletedAt),
        ) ?? null,
      create: async ({ data }: any) => {
        const record = { id: id(), createdAt: now(), updatedAt: now(), deletedAt: null, ...data };
        services.push(record);
        return record;
      },
      update: async ({ where, data }: any) => {
        const record = services.find((service) => service.id === where.id);
        Object.assign(record, data, { updatedAt: now() });
        return record;
      },
      upsert: async ({ where, create, update }: any) => {
        const record = services.find((service) => service.id === where.id);
        if (record) return Object.assign(record, update);
        const next = {
          createdAt: now(),
          updatedAt: now(),
          deletedAt: null,
          status: "ACTIVE",
          ...create,
        };
        services.push(next);
        return next;
      },
      deleteMany: async () => ({ count: 0 }),
    },
    companySettings: {
      findFirst: async () => company,
      create: async () => company,
      upsert: async () => company,
    },
    documentSequence: {
      upsert: async ({ where, update, create }: any) => {
        const key = `${where.type_year.type}-${where.type_year.year}`;
        const current = sequences.get(key) ?? {
          id: id(),
          type: create.type,
          year: create.year,
          lastValue: 0,
          createdAt: now(),
          updatedAt: now(),
        };
        current.lastValue += update.lastValue.increment;
        sequences.set(key, current);
        return current;
      },
    },
    auditLog: {
      create: async ({ data }: any) => {
        const record = { id: id(), createdAt: now(), updatedAt: now(), ...data };
        auditLogs.push(record);
        return record;
      },
    },
    quote: {
      findMany: async ({ where, skip = 0, take = 20 }: any = {}) =>
        quotes
          .filter(
            (quote) =>
              (!where?.status || quote.status === where.status) &&
              matchesSearch(quote.number, where?.OR?.[0]?.number?.contains),
          )
          .slice(skip, skip + take)
          .map(attachQuoteRelations),
      count: async () => quotes.length,
      findUnique: async ({ where }: any) => {
        const quote = quotes.find((quote) => quote.id === where.id);
        return quote ? attachQuoteRelations(quote) : null;
      },
      create: async ({ data }: any) => {
        const { items, ...quoteData } = data;
        const quote = {
          id: id(),
          status: "RASCUNHO",
          issuedAt: now(),
          createdAt: now(),
          updatedAt: now(),
          ...quoteData,
        };
        quotes.push(quote);
        for (const item of items.create) {
          quoteItems.push({
            id: id(),
            quoteId: quote.id,
            createdAt: now(),
            updatedAt: now(),
            ...item,
          });
        }
        return attachQuoteRelations(quote);
      },
      update: async ({ where, data }: any) => {
        const quote = quotes.find((quote) => quote.id === where.id);
        if (data.items?.create) {
          data.items.create.forEach((item: any) =>
            quoteItems.push({
              id: id(),
              quoteId: quote.id,
              createdAt: now(),
              updatedAt: now(),
              ...item,
            }),
          );
        }
        delete data.items;
        Object.assign(quote, data, { updatedAt: now() });
        return attachQuoteRelations(quote);
      },
      deleteMany: async () => ({ count: 0 }),
    },
    quoteItem: {
      deleteMany: async ({ where }: any) => {
        const before = quoteItems.length;
        for (let index = quoteItems.length - 1; index >= 0; index -= 1) {
          if (quoteItems[index].quoteId === where.quoteId) quoteItems.splice(index, 1);
        }
        return { count: before - quoteItems.length };
      },
    },
    workOrder: {
      findMany: async ({ where, skip = 0, take = 20 }: any = {}) => {
        const search =
          where?.OR?.[0]?.number?.contains ??
          where?.OR?.[1]?.client?.name?.contains ??
          where?.OR?.[2]?.problemDescription?.contains;
        return workOrders
          .filter(
            (workOrder) =>
              (!where?.status || workOrder.status === where.status) &&
              (matchesSearch(workOrder.number, search) ||
                matchesSearch(workOrder.problemDescription, search) ||
                matchesSearch(
                  clients.find((client) => client.id === workOrder.clientId)?.name,
                  search,
                )),
          )
          .slice(skip, skip + take)
          .map(attachWorkOrderRelations);
      },
      count: async ({ where }: any = {}) =>
        workOrders.filter((workOrder) => !where?.status || workOrder.status === where.status)
          .length,
      findUnique: async ({ where }: any) => {
        const workOrder = workOrders.find((record) => record.id === where.id);
        return workOrder ? attachWorkOrderRelations(workOrder) : null;
      },
      findFirst: async ({ where }: any) =>
        workOrders.find(
          (record) =>
            (!where.id || record.id === where.id) &&
            (!where.quoteId || record.quoteId === where.quoteId) &&
            (!where.status || record.status === where.status),
        ) ?? null,
      create: async ({ data }: any) => {
        const { items, ...workOrderData } = data;
        const workOrder = {
          id: id(),
          openedAt: now(),
          completedAt: null,
          status: "ABERTA",
          stockDeductedAt: null,
          createdAt: now(),
          updatedAt: now(),
          ...workOrderData,
        };
        workOrders.push(workOrder);
        for (const item of items?.create ?? []) {
          workOrderItems.push({
            id: id(),
            workOrderId: workOrder.id,
            createdAt: now(),
            updatedAt: now(),
            ...item,
          });
        }
        return attachWorkOrderRelations(workOrder);
      },
      update: async ({ where, data }: any) => {
        const workOrder = workOrders.find((record) => record.id === where.id);
        if (data.items?.create) {
          data.items.create.forEach((item: any) =>
            workOrderItems.push({
              id: id(),
              workOrderId: workOrder.id,
              createdAt: now(),
              updatedAt: now(),
              ...item,
            }),
          );
        }
        delete data.items;
        Object.assign(workOrder, data, { updatedAt: now() });
        return attachWorkOrderRelations(workOrder);
      },
      deleteMany: async () => ({ count: 0 }),
    },
    workOrderItem: {
      deleteMany: async ({ where }: any) => {
        const before = workOrderItems.length;
        for (let index = workOrderItems.length - 1; index >= 0; index -= 1) {
          if (workOrderItems[index].workOrderId === where.workOrderId)
            workOrderItems.splice(index, 1);
        }
        return { count: before - workOrderItems.length };
      },
    },
    stockMovement: {
      findFirst: async ({ where }: any) =>
        stockMovements.find(
          (movement) =>
            (!where.workOrderItemId || movement.workOrderItemId === where.workOrderItemId) &&
            (!where.productId || movement.productId === where.productId),
        ) ?? null,
      findMany: async ({ where, skip = 0, take = 20 }: any = {}) =>
        stockMovements
          .filter((movement) => !where?.productId || movement.productId === where.productId)
          .slice(skip, skip + take)
          .map((movement) => ({
            ...movement,
            product: products.find((product) => product.id === movement.productId),
          })),
      count: async ({ where }: any = {}) =>
        stockMovements.filter(
          (movement) => !where?.productId || movement.productId === where.productId,
        ).length,
      create: async ({ data }: any) => {
        const record = { id: id(), createdAt: now(), updatedAt: now(), ...data };
        stockMovements.push(record);
        return record;
      },
      deleteMany: async () => ({ count: 0 }),
    },
    payment: {
      findMany: async ({ where, skip = 0, take = 20 }: any = {}) =>
        payments
          .filter((payment) => !where?.status || payment.status === where.status)
          .slice(skip, skip + take)
          .map(attachPaymentRelations),
      count: async ({ where }: any = {}) =>
        payments.filter((payment) => !where?.status || payment.status === where.status).length,
      findUnique: async ({ where }: any) => {
        const payment = payments.find((record) => record.id === where.id);
        return payment ? attachPaymentRelations(payment) : null;
      },
      create: async ({ data }: any) => {
        const record = { id: id(), createdAt: now(), updatedAt: now(), ...data };
        payments.push(record);
        return attachPaymentRelations(record);
      },
      update: async ({ where, data }: any) => {
        const record = payments.find((payment) => payment.id === where.id);
        Object.assign(record, data, { updatedAt: now() });
        return attachPaymentRelations(record);
      },
      deleteMany: async () => ({ count: 0 }),
    },
    attachment: {
      findMany: async ({ where }: any = {}) =>
        attachments.filter(
          (attachment) =>
            (!where?.workOrderId || attachment.workOrderId === where.workOrderId) &&
            (where?.deletedAt === undefined || attachment.deletedAt === where.deletedAt),
        ),
      findFirst: async ({ where }: any) =>
        attachments.find(
          (attachment) =>
            (!where.id || attachment.id === where.id) &&
            (where.deletedAt === undefined || attachment.deletedAt === where.deletedAt),
        ) ?? null,
      create: async ({ data }: any) => {
        const record = {
          id: id(),
          createdAt: now(),
          updatedAt: now(),
          deletedAt: null,
          ...data,
        };
        attachments.push(record);
        return record;
      },
      update: async ({ where, data }: any) => {
        const record = attachments.find((attachment) => attachment.id === where.id);
        Object.assign(record, data, { updatedAt: now() });
        return record;
      },
      deleteMany: async () => ({ count: 0 }),
    },
  };
}
