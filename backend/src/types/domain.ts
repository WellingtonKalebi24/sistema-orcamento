export type UserRole = "ADMIN" | "ATENDENTE" | "TECNICO" | "FINANCEIRO";
export type RecordStatus = "ACTIVE" | "INACTIVE";
export type QuoteStatus = "RASCUNHO" | "ENVIADO" | "APROVADO" | "RECUSADO" | "EXPIRADO";
export type ItemType = "SERVICE" | "PRODUCT";

export const userRoles: UserRole[] = ["ADMIN", "ATENDENTE", "TECNICO", "FINANCEIRO"];
export const quoteStatuses: QuoteStatus[] = [
  "RASCUNHO",
  "ENVIADO",
  "APROVADO",
  "RECUSADO",
  "EXPIRADO",
];
