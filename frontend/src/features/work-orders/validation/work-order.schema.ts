import { z } from "zod";

export const workOrderFormSchema = z.object({
  clientId: z.string().uuid(),
  expectedAt: z.string().optional(),
  problemDescription: z.string().min(3),
  laborCost: z.string().default("0.00"),
  chargedAmount: z.string().default("0.00"),
});
