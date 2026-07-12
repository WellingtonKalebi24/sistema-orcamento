import { z } from "zod";

export const userInputSchema = z.object({
  name: z.string().trim().min(2),
  email: z
    .string()
    .trim()
    .email()
    .transform((value) => value.toLowerCase()),
  password: z.string().min(8).max(72),
  role: z.enum(["ADMIN", "ATENDENTE", "TECNICO", "FINANCEIRO"]),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE"),
});

export const userUpdateSchema = userInputSchema
  .partial()
  .extend({ password: z.string().min(8).max(72).optional() });

export const userStatusSchema = z.object({
  status: z.enum(["ACTIVE", "INACTIVE"]),
});

export type UserInput = z.infer<typeof userInputSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
