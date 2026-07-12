import { z } from "zod";

import { onlyDigits } from "../utils/documents";

export const companySettingsInputSchema = z.object({
  companyName: z.string().trim().min(2),
  systemName: z.string().trim().min(2).max(40).default("Sistema OS"),
  cnpj: z.string().transform(onlyDigits).pipe(z.string().min(14).max(14)),
  phone: z.string().trim().nullish().transform(emptyToUndefined),
  whatsapp: z.string().trim().nullish().transform(emptyToUndefined),
  email: z.string().email().nullish().or(z.literal("")).transform(emptyToUndefined),
  address: z.string().trim().nullish().transform(emptyToUndefined),
  pixKey: z.string().trim().nullish().transform(emptyToUndefined),
  bankDetails: z.string().trim().nullish().transform(emptyToUndefined),
  defaultQuoteText: z.string().trim().nullish().transform(emptyToUndefined),
  defaultPdfFooter: z.string().trim().nullish().transform(emptyToUndefined),
  allowNegativeStock: z.boolean().default(false),
  primaryColor: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i)
    .default("#245dde"),
  sidebarColor: z
    .string()
    .regex(/^#[0-9a-f]{6}$/i)
    .default("#12233e"),
  timezone: z.string().trim().default("America/Sao_Paulo"),
});

function emptyToUndefined(value: string | null | undefined) {
  return value || undefined;
}

export type CompanySettingsInput = z.infer<typeof companySettingsInputSchema>;
