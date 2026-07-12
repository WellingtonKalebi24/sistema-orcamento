import { z } from "zod";

import { moneySchema, quantitySchema, uuidSchema } from "./common.schemas";

const quoteItemSchema = z
  .object({
    type: z.enum(["SERVICE", "PRODUCT"]),
    productId: uuidSchema.optional(),
    serviceId: uuidSchema.optional(),
    quantity: quantitySchema,
    unitPrice: moneySchema.optional(),
    discountAmount: moneySchema.default("0.00"),
  })
  .refine(
    (item) =>
      item.type === "PRODUCT"
        ? Boolean(item.productId) && !item.serviceId
        : Boolean(item.serviceId) && !item.productId,
    {
      message: "Informe produto ou servico conforme o tipo do item.",
    },
  );

export const quoteInputSchema = z.object({
  clientId: uuidSchema,
  validUntil: z.coerce.date(),
  requestDescription: z.string().trim().min(3),
  items: z.array(quoteItemSchema).min(1),
  laborAmount: moneySchema.default("0.00"),
  travelFee: moneySchema.default("0.00"),
  generalDiscount: moneySchema.default("0.00"),
  paymentTerms: z.string().trim().optional(),
  executionDeadline: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export const quoteStatusSchema = z.object({
  status: z.enum(["ENVIADO", "APROVADO", "RECUSADO", "EXPIRADO"]),
  note: z.string().trim().optional(),
});

export type QuoteInput = z.infer<typeof quoteInputSchema>;
export type QuoteItemInput = QuoteInput["items"][number];
