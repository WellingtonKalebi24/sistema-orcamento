import { z } from "zod";

import { moneySchema, quantitySchema } from "./common.schemas";

export const workOrderStatusSchema = z.enum([
  "ABERTA",
  "EM_ANDAMENTO",
  "AGUARDANDO_PECA",
  "CONCLUIDA",
  "CANCELADA",
]);

export const workOrderEditableStatusSchema = z.enum([
  "ABERTA",
  "EM_ANDAMENTO",
  "AGUARDANDO_PECA",
  "CANCELADA",
]);

const workOrderItemInputSchema = z
  .object({
    type: z.enum(["SERVICE", "PRODUCT"]),
    productId: z.string().uuid().optional(),
    serviceId: z.string().uuid().optional(),
    plannedQuantity: quantitySchema.default("1.000"),
    usedQuantity: quantitySchema.default("0.000"),
    unitPrice: moneySchema.optional(),
    unitCost: moneySchema.optional(),
  })
  .refine(
    (item) =>
      item.type === "PRODUCT"
        ? Boolean(item.productId) && !item.serviceId
        : Boolean(item.serviceId) && !item.productId,
    { message: "Informe produto ou servico conforme o tipo do item." },
  );

export const workOrderInputSchema = z.object({
  clientId: z.string().uuid(),
  technicianId: z.string().uuid().optional(),
  expectedAt: z.coerce.date().optional(),
  problemDescription: z.string().trim().min(3),
  executionDescription: z.string().trim().optional(),
  internalNotes: z.string().trim().optional(),
  clientNotes: z.string().trim().optional(),
  laborCost: moneySchema.default("0.00"),
  chargedAmount: moneySchema.default("0.00"),
  items: z.array(workOrderItemInputSchema).min(1),
});

export const workOrderUpdateSchema = workOrderInputSchema
  .omit({ clientId: true })
  .partial()
  .extend({
    status: workOrderEditableStatusSchema.optional(),
  });

export const workOrderConversionSchema = z.object({
  technicianId: z.string().uuid().optional(),
  expectedAt: z.coerce.date().optional(),
});

export const workOrderCompletionSchema = z.object({
  executionDescription: z.string().trim().optional(),
  clientNotes: z.string().trim().optional(),
  internalNotes: z.string().trim().optional(),
});

export type WorkOrderInput = z.infer<typeof workOrderInputSchema>;
export type WorkOrderUpdateInput = z.infer<typeof workOrderUpdateSchema>;
export type WorkOrderConversionInput = z.infer<typeof workOrderConversionSchema>;
export type WorkOrderCompletionInput = z.infer<typeof workOrderCompletionSchema>;
export type WorkOrderItemInput = WorkOrderInput["items"][number];
