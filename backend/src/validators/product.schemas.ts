import { z } from "zod";

import { moneySchema, quantitySchema } from "./common.schemas";

export const productInputSchema = z.object({
  name: z.string().trim().min(2),
  sku: z.string().trim().min(2).optional(),
  category: z.string().trim().min(2),
  supplier: z.string().trim().optional(),
  unit: z.string().trim().min(1).default("UN"),
  stockQuantity: quantitySchema.default("0.000"),
  minimumStock: quantitySchema.default("0.000"),
  costPrice: moneySchema.default("0.00"),
  salePrice: moneySchema.default("0.00"),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const productUpdateSchema = productInputSchema.partial();

export type ProductInput = z.infer<typeof productInputSchema>;
export type ProductUpdateInput = z.infer<typeof productUpdateSchema>;
