import { z } from "zod";

import { onlyDigits } from "../utils/documents";

export const clientInputSchema = z.object({
  name: z.string().trim().min(2),
  personType: z.enum(["PF", "PJ"]),
  document: z.string().transform(onlyDigits).pipe(z.string().min(11).max(14)),
  phone: z.string().trim().optional(),
  whatsapp: z.string().trim().optional(),
  email: z.string().email().optional().or(z.literal("")),
  street: z.string().trim().optional(),
  number: z.string().trim().optional(),
  complement: z.string().trim().optional(),
  district: z.string().trim().optional(),
  city: z.string().trim().optional(),
  state: z.string().trim().max(2).optional(),
  zipCode: z.string().transform(onlyDigits).optional(),
  notes: z.string().trim().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export type ClientInput = z.infer<typeof clientInputSchema>;
