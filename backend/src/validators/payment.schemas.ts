import { z } from "zod";

import { moneySchema } from "./common.schemas";

const paymentBaseSchema = z.object({
  quoteId: z.string().uuid().optional(),
  workOrderId: z.string().uuid().optional(),
  method: z.enum(["DINHEIRO", "PIX", "CARTAO", "BOLETO", "TRANSFERENCIA"]),
  amount: moneySchema,
  paidAmount: moneySchema.default("0.00"),
  dueDate: z.coerce.date().optional(),
  paidAt: z.coerce.date().optional(),
  notes: z.string().trim().optional(),
});

export const paymentInputSchema = paymentBaseSchema.refine(
  (input) => Boolean(input.quoteId) !== Boolean(input.workOrderId),
  {
    message: "Informe exatamente um vinculo: orcamento ou ordem de servico.",
  },
);

export const paymentUpdateSchema = paymentBaseSchema.partial().extend({
  status: z.enum(["PENDENTE", "PARCIAL", "PAGO", "CANCELADO"]).optional(),
});

export type PaymentInput = z.infer<typeof paymentInputSchema>;
export type PaymentUpdateInput = z.infer<typeof paymentUpdateSchema>;
