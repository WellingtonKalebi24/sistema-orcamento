import { z } from "zod";

import { quantitySchema } from "./common.schemas";

export const stockMovementInputSchema = z.object({
  type: z.enum(["ENTRY", "EXIT", "ADJUSTMENT"]),
  quantity: quantitySchema,
  reason: z.string().trim().min(3),
});

export type StockMovementInput = z.infer<typeof stockMovementInputSchema>;
