import { z } from "zod";

export const quoteFormSchema = z.object({
  clientId: z.string().uuid(),
  validUntil: z.string().min(1),
  requestDescription: z.string().min(3),
  paymentTerms: z.string().optional(),
  executionDeadline: z.string().optional(),
  notes: z.string().optional(),
});
