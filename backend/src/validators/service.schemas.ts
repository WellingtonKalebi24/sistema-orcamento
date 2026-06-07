import { z } from "zod";

import { moneySchema } from "./common.schemas";

export const serviceInputSchema = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().min(3),
  category: z.string().trim().min(2),
  defaultPrice: moneySchema.default("0.00"),
  estimatedMinutes: z.coerce.number().int().positive().default(60),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const serviceUpdateSchema = serviceInputSchema.partial();

export type ServiceInput = z.infer<typeof serviceInputSchema>;
export type ServiceUpdateInput = z.infer<typeof serviceUpdateSchema>;
