import { z } from "zod";

export const idParamSchema = z.object({
  id: z.string().uuid(),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().trim().max(100).optional(),
  status: z.string().trim().optional(),
  from: z.string().optional(),
  to: z.string().optional(),
});

export const moneySchema = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/, "Informe valor monetario com ate 2 casas decimais.");

export const quantitySchema = z
  .string()
  .regex(/^\d+(\.\d{1,3})?$/, "Informe quantidade com ate 3 casas decimais.");
